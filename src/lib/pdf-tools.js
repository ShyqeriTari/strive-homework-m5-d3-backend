import PdfPrinter from "pdfmake"

export const getPDFstream = (header, text, imageUrl) => {

   const fonts = {
        Helvetica: {
          normal: 'Helvetica',
          bold: 'Helvetica-Bold',
        }
      };
      
     const printer = new PdfPrinter(fonts);
      
    const docDefinition = {

            content: [
        
                {
                    image: "image",
                    fit: [520, 520]
                },
                {
                    text: header,
                    style: 'header',
                    
                },
                text,
            ],
            images: {
                image: imageUrl

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
      
      
     const pdfStream = printer.createPdfKitDocument(docDefinition, {});
    
      pdfStream.end()
    return pdfStream

}
