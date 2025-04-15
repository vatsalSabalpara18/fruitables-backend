const fonts = {
    Roboto: {
        normal: 'public/fonts/static/Roboto-Regular.ttf',
        bold: 'public/fonts/static/Roboto-Bold.ttf',
        italics: 'public/fonts/static/Roboto-Italic.ttf',
        bolditalics: 'public/fonts/static/Roboto-BoldItalic.ttf'
    }
}

const PdfPrinter = require('pdfmake');
const printer = new PdfPrinter(fonts);
const fs = require('fs');

const createPDF = async (docDefinition, name) => {    
    try {
        const options = {}
        const pdfDoc = printer.createPdfKitDocument(docDefinition, options);
        pdfDoc.pipe(fs.createWriteStream('public/users/' + name + '.pdf'));
        pdfDoc.end();
    } catch (error) {
        console.error('err', error);
    }

}

module.exports = createPDF;