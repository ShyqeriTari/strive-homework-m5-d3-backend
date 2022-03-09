import PdfPrinter from "pdfmake"

export const getPDFstream = (header, text, imageUrl) => {

   const fonts = {
        Helvetica: {
          normal: 'Helvetica',
          bold: 'Helvetica-Bold',
          italics: 'Helvetica-Italics',
        }
      };
      
     const printer = new PdfPrinter(fonts);
      
    const docDefinition = {

            content: [
        
                {
                    image: 'sampleImage.jpg',
                    fit: [520, 520]
                },
                {
                    text: header,
                    style: 'header',
                    
                },
                text,
            ],
            
            images: {
                building: imageUrl
            },
            
            styles: {
                header: {
                    fontSize: 18,
                    bold: true,
                    margin: [0,8]
                },
            
        },
        defaultStyle:{
            font: "Helvetica"
        }
        
      };
      
      
     const pdfStream = printer.createPdfKitDocument(docDefinition);
    
      pdfStream.end();
    return pdfStream

}
