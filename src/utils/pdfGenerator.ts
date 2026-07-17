import { jsPDF } from "jspdf";
import { DashboardStats, StudySessionRecord, NoteAnalysisResult } from "../types";

/**
 * Exports the academic dashboard profile and complete study session logs to a printer-friendly PDF.
 */
export function exportDashboardToPDF(stats: DashboardStats, sessions: StudySessionRecord[]) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4"
  });
  
  let y = 15;

  const checkPageBreak = (heightNeeded: number) => {
    if (y + heightNeeded > 275) {
      doc.addPage();
      y = 15;
    }
  };

  // Header Banner Block
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(15, y, 180, 24, "F");
  
  doc.setTextColor(255, 255, 255);
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(16);
  doc.text("VERTEXAI - SCHOLAR WORKSPACE REPORT", 22, y + 10);
  
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(148, 163, 184); // slate-400
  doc.text(`GENERATED: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()} | SYSTEM: ACTIVE`, 22, y + 17);
  y += 35;

  // Overview Stats Section Header
  doc.setTextColor(15, 23, 42); // slate-900
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(13);
  doc.text("I. ACADEMIC PROFILE METRICS", 15, y);
  
  // Underline
  doc.setDrawColor(6, 182, 212); // cyan-500
  doc.setLineWidth(0.6);
  doc.line(15, y + 2, 195, y + 2);
  y += 10;

  // Draw Stats Grid Card background
  doc.setFillColor(248, 250, 252); // slate-50
  doc.setDrawColor(226, 232, 240); // slate-200
  doc.rect(15, y, 180, 32, "FD");

  doc.setFontSize(9.5);
  doc.setTextColor(71, 85, 105); // slate-600

  // Column 1
  doc.setFont("Helvetica", "bold");
  doc.text("Current Level:", 20, y + 8);
  doc.setFont("Helvetica", "normal");
  doc.text(`Level ${stats.level} Scholar`, 50, y + 8);

  doc.setFont("Helvetica", "bold");
  doc.text("Total Experience:", 20, y + 16);
  doc.setFont("Helvetica", "normal");
  doc.text(`${stats.xp} / ${stats.xpNeeded} XP`, 50, y + 16);

  doc.setFont("Helvetica", "bold");
  doc.text("Syllabi Tracked:", 20, y + 24);
  doc.setFont("Helvetica", "normal");
  doc.text(`${stats.activeProjects} active subjects`, 50, y + 24);

  // Column 2
  doc.setFont("Helvetica", "bold");
  doc.text("Duration Logged:", 110, y + 8);
  doc.setFont("Helvetica", "normal");
  doc.text(`${stats.totalHours.toFixed(1)} hrs logged`, 142, y + 8);

  doc.setFont("Helvetica", "bold");
  doc.text("Current Streak:", 110, y + 16);
  doc.setFont("Helvetica", "normal");
  doc.text(`${stats.streak} consecutive days`, 142, y + 16);

  doc.setFont("Helvetica", "bold");
  doc.text("Quiz Proficiency:", 110, y + 24);
  doc.setFont("Helvetica", "normal");
  doc.text(`${stats.avgQuizScore}% average`, 142, y + 24);

  y += 45;

  // Study Chronology List Header
  checkPageBreak(30);
  doc.setTextColor(15, 23, 42);
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(13);
  doc.text("II. RECENCY CHRONOLOGY STUDY LOG", 15, y);
  doc.setDrawColor(99, 102, 241); // indigo-500
  doc.line(15, y + 2, 195, y + 2);
  y += 10;

  if (sessions.length === 0) {
    doc.setFont("Helvetica", "italic");
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text("No study logs registered in current workbook.", 15, y);
    y += 10;
  } else {
    // Reverse chronological order for recent logs first
    const chronologicalSessions = sessions.slice().reverse();
    chronologicalSessions.forEach((session, idx) => {
      const summaryText = session.summary || "No analysis or summary detailed.";
      const wrappedSummary = doc.splitTextToSize(summaryText, 172);
      
      // Calculate height of item block
      // Header rect: 7mm, gap: 4mm, lines: wrappedSummary * 4.5mm, extra: 6mm
      const itemHeight = 10 + (wrappedSummary.length * 4.5) + (session.score !== undefined ? 5 : 0) + 4;
      
      checkPageBreak(itemHeight);

      // Log Header Bar
      doc.setFillColor(241, 245, 249); // slate-100
      doc.rect(15, y, 180, 7, "F");

      doc.setFont("Helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(15, 23, 42);
      doc.text(`${idx + 1}. ${session.subject} - ${session.topic || "General Study Session"}`, 18, y + 4.8);

      doc.setFont("Helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(100, 116, 139);
      doc.text(`${session.date} | ${session.durationMinutes} minutes`, 150, y + 4.8);
      y += 11;

      // Score
      if (session.score !== undefined) {
        doc.setFont("Helvetica", "bold");
        doc.setFontSize(8.5);
        doc.setTextColor(6, 182, 212); // cyan-500
        doc.text(`Assessment Trial Grade: ${session.score}%`, 18, y);
        y += 4.5;
      }

      // Summary description body
      doc.setFont("Helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(51, 65, 85); // slate-700
      doc.text(wrappedSummary, 18, y);
      y += (wrappedSummary.length * 4.5) + 6;
    });
  }

  // Add Footers and page numbers on all pages
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184); // slate-400
    doc.text(`VertexAI Workspace Terminal • Report generated for mahaveergautamji@gmail.com`, 15, 287);
    doc.text(`Page ${i} of ${pageCount}`, 175, 287);
  }

  doc.save(`VertexAI_Academic_Summary_${new Date().toISOString().split("T")[0]}.pdf`);
}

/**
 * Exports the Study Copilot Note deconstruction analysis (outline and glossary) to a printer-friendly PDF.
 */
export function exportNotesAnalysisToPDF(result: NoteAnalysisResult) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4"
  });

  let y = 15;

  const checkPageBreak = (heightNeeded: number) => {
    if (y + heightNeeded > 275) {
      doc.addPage();
      y = 15;
    }
  };

  // Header Banner Block
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(15, y, 180, 24, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(15);
  doc.text("VERTEXAI - COGNITIVE DOCUMENT SUMMARY", 22, y + 10);

  doc.setFont("Helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(148, 163, 184); // slate-400
  doc.text(`COGNITIVE STUDY COPILOT ANALYZER REPORT`, 22, y + 17);
  y += 35;

  // Topic Header
  doc.setTextColor(15, 23, 42);
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(13);
  doc.text(`DECONSTRUCTED TOPIC: ${result.mindMap.label.toUpperCase()}`, 15, y);
  
  doc.setDrawColor(6, 182, 212); // cyan-500
  doc.setLineWidth(0.6);
  doc.line(15, y + 2, 195, y + 2);
  y += 12;

  // Summary Outline Section
  doc.setTextColor(15, 23, 42);
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(11);
  doc.text("I. COMPREHENSIVE CONCEPT OUTLINE", 15, y);
  y += 7;

  doc.setFont("Helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(51, 65, 85); // slate-700

  result.summary.forEach((bullet, idx) => {
    const text = `${idx + 1}. ${bullet}`;
    const wrappedText = doc.splitTextToSize(text, 175);
    const textHeight = wrappedText.length * 4.5 + 2;

    checkPageBreak(textHeight);
    doc.text(wrappedText, 15, y);
    y += textHeight;
  });
  y += 8;

  // Glossary Section
  checkPageBreak(35);
  doc.setTextColor(15, 23, 42);
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(11);
  doc.text("II. SYSTEMATIC TERMINOLOGY GLOSSARY", 15, y);
  doc.setDrawColor(99, 102, 241); // indigo-500
  doc.line(15, y + 2, 195, y + 2);
  y += 10;

  result.glossary.forEach((item, idx) => {
    const termHeader = `${idx + 1}. ${item.term.toUpperCase()}`;
    const definition = item.definition;
    const wrappedDef = doc.splitTextToSize(definition, 170);
    const itemHeight = 6 + (wrappedDef.length * 4.5) + 4;

    checkPageBreak(itemHeight);

    // Term
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(6, 182, 212); // cyan-500
    doc.text(termHeader, 15, y);
    y += 5;

    // Definition
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(51, 65, 85); // slate-700
    doc.text(wrappedDef, 18, y);
    y += (wrappedDef.length * 4.5) + 5;
  });

  // Footers
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184); // slate-400
    doc.text(`VertexAI Workspace Terminal • Report generated for mahaveergautamji@gmail.com`, 15, 287);
    doc.text(`Page ${i} of ${pageCount}`, 175, 287);
  }

  const sanitizedFilename = result.mindMap.label.toLowerCase().replace(/[^a-z0-9]+/g, "_");
  doc.save(`VertexAI_Analysis_${sanitizedFilename}.pdf`);
}
