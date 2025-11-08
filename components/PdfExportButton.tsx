
import React, { useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface PdfExportButtonProps {
  elementId: string;
  fileName?: string;
}

const PdfExportButton: React.FC<PdfExportButtonProps> = ({ elementId, fileName = 'Automation_ROI_Report.pdf' }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleExport = async () => {
    const element = document.getElementById(elementId);
    if (!element) {
      console.error('Element not found for PDF export');
      return;
    }

    setIsLoading(true);

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: '#020617',
        useCORS: true,
        ignoreElements: (el) => el.classList.contains('no-export'),
        onclone: (document) => {
            // Fix for recharts SVG rendering in html2canvas
            Array.from(document.querySelectorAll('.recharts-surface')).forEach(svg => {
                // Fix: Cast the element to SVGElement. The 'svg' variable was implicitly typed as 'unknown' or 'Element',
                // which lacks the 'style' property and was causing type errors.
                // SVGElement is the correct type for Recharts containers and has all necessary properties.
                const svgEl = svg as SVGElement;
                const parent = svgEl.parentElement;
                if (parent) {
                    svgEl.setAttribute('width', parent.offsetWidth.toString());
                    svgEl.setAttribute('height', parent.offsetHeight.toString());
                    svgEl.style.width = `${parent.offsetWidth}px`;
                    svgEl.style.height = `${parent.offsetHeight}px`;
                }
            });
        }
      });
      
      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'pt',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;

      const ratio = canvasWidth / pdfWidth;
      const imgHeight = canvasHeight / ratio;
      
      let heightLeft = imgHeight;
      let position = 0;
      let page = 1;
      
      const totalPages = Math.ceil(imgHeight / pdfHeight);

      const addHeaderFooter = (currentPage: number) => {
          pdf.setFontSize(9);
          pdf.setTextColor(150);
          
          const industryName = fileName.replace(/ROI_Report_|\.pdf/g, '').replace(/_/g, ' ');
          const headerText = `Automation ROI Report: ${industryName}`;
          pdf.text(headerText, pdfWidth / 2, 25, { align: 'center' });
          
          const footerText = `Page ${currentPage} of ${totalPages}`;
          pdf.text(footerText, pdfWidth / 2, pdfHeight - 18, { align: 'center' });
      };

      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
      addHeaderFooter(page);
      heightLeft -= pdfHeight;

      while (heightLeft > 0) {
        position -= pdfHeight;
        page++;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
        addHeaderFooter(page);
        heightLeft -= pdfHeight;
      }
      
      pdf.save(fileName);

    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="text-center py-8">
      <button
        onClick={handleExport}
        disabled={isLoading}
        className="px-8 py-3 font-bold rounded-lg bg-gradient-to-r from-indigo-500 to-cyan-400 text-white shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 flex items-center justify-center mx-auto"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generating PDF...
          </>
        ) : (
          'Download Full Report as PDF'
        )}
      </button>
    </div>
  );
};

export default PdfExportButton;
