const fs = require('fs-extra');
const path = require('path');
const archiver = require('archiver');
const JavaScriptObfuscator = require('javascript-obfuscator');
const { minify } = require('html-minifier-terser');

const rootDir = __dirname;
const distDir = path.join(rootDir, 'dist');
const manifestPath = path.join(rootDir, 'manifest.json');

async function build() {
    console.log('Starting build process...');

    // 1. Read manifest to get name and version
    if (!fs.existsSync(manifestPath)) {
        console.error('manifest.json not found!');
        process.exit(1);
    }
    const manifest = await fs.readJson(manifestPath);
    const version = manifest.version;
    // Sanitize name for filename (allow unicode, replace only path separators and problematic chars)
    const safeName = manifest.name.replace(/[\/\\:*?"<>|]/g, '_');

    // Generate timestamp
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hour = String(now.getHours()).padStart(2, '0');
    const minute = String(now.getMinutes()).padStart(2, '0');
    const timestamp = `${year}${month}${day}_${hour}${minute}`;

    const zipFileName = `${safeName}_v${version}_${timestamp}.zip`;

    // 2. Clear and create dist directory
    await fs.emptyDir(distDir);
    console.log(`Created empty dist directory: ${distDir}`);

    // 3. Copy static assets
    const filesToCopy = [
        'manifest.json',
        'styles.css',
        'icons', // directory
        'LICENSE',
        'README.md',
        'rules.json'
    ];

    for (const file of filesToCopy) {
        const src = path.join(rootDir, file);
        const dest = path.join(distDir, file);
        if (fs.existsSync(src)) {
            await fs.copy(src, dest);
            console.log(`Copied ${file}`);
        } else {
            console.warn(`Warning: ${file} not found, skipping.`);
        }
    }

    // 4. Bundle or obfuscate script.js
    // If src/ directory exists, concatenate module files in order; otherwise fall back to script.js
    const srcDir = path.join(rootDir, 'src');
    let scriptContent;
    if (fs.existsSync(srcDir)) {
        const srcFiles = fs.readdirSync(srcDir)
            .filter(f => f.endsWith('.js'))
            .sort(); // numeric prefix ensures correct order
        const parts = await Promise.all(
            srcFiles.map(f => fs.readFile(path.join(srcDir, f), 'utf8'))
        );
        scriptContent = parts.join('\n');
        console.log(`Bundled ${srcFiles.length} modules from src/: ${srcFiles.join(', ')}`);
    } else {
        const scriptPath = path.join(rootDir, 'script.js');
        if (!fs.existsSync(scriptPath)) {
            console.error('Neither src/ directory nor script.js found!');
            process.exit(1);
        }
        scriptContent = await fs.readFile(scriptPath, 'utf8');
        console.log('Using script.js directly (no src/ directory found).');
    }

    // Lightweight obfuscation — keeps basic protection without heavy transform overhead
    const obfuscationResult = JavaScriptObfuscator.obfuscate(scriptContent, {
        compact: true,
        controlFlowFlattening: false,
        deadCodeInjection: false,
        debugProtection: false,
        disableConsoleOutput: true,
        identifierNamesGenerator: 'hexadecimal',
        log: false,
        numbersToExpressions: false,
        renameGlobals: false,
        selfDefending: false,
        simplify: true,
        splitStrings: false,
        stringArray: false,
        unicodeEscapeSequence: false
    });

    await fs.writeFile(path.join(distDir, 'script.js'), obfuscationResult.getObfuscatedCode());
    console.log('Obfuscated script.js');

    // 5. Minify newtab.html
    const htmlPath = path.join(rootDir, 'newtab.html');
    if (fs.existsSync(htmlPath)) {
        const htmlContent = await fs.readFile(htmlPath, 'utf8');
        const minifiedHtml = await minify(htmlContent, {
            removeAttributeQuotes: true,
            collapseWhitespace: true,
            removeComments: true,
            minifyJS: true,
            minifyCSS: true
        });
        await fs.writeFile(path.join(distDir, 'newtab.html'), minifiedHtml);
        console.log('Minified newtab.html');
    }

    // 6. Create Zip in release directory
    const releaseDir = path.join(rootDir, 'release');
    await fs.ensureDir(releaseDir);
    const outputZipPath = path.join(releaseDir, zipFileName);
    const output = fs.createWriteStream(outputZipPath);
    const archive = archiver('zip', {
        zlib: { level: 9 } // Sets the compression level.
    });

    output.on('close', async function () {
        console.log(`${zipFileName} created successfully in release/! Total bytes: ${archive.pointer()}`);

        // 7. Cleanup dist directory
        try {
            await fs.remove(distDir);
            console.log('Cleaned up dist directory.');
        } catch (err) {
            console.error('Error removing dist directory:', err);
        }
    });

    archive.on('warning', function (err) {
        if (err.code === 'ENOENT') {
            console.warn(err);
        } else {
            throw err;
        }
    });

    archive.on('error', function (err) {
        throw err;
    });

    archive.pipe(output);
    archive.directory(distDir, false); // append files from distDir, putting its contents at the root of archive
    await archive.finalize();
}

build().catch(err => {
    console.error('Build failed:', err);
    process.exit(1);
});
