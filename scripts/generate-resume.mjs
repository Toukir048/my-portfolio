import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const publicDir = path.join(root, "public");

async function readJson(fileName) {
  const raw = await readFile(path.join(publicDir, fileName), "utf8");
  return JSON.parse(raw);
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function listSkills(skills) {
  return Object.entries(skills)
    .map(([category, items]) => {
      const names = items.map((item) => item.name).join(", ");
      return `<p><strong>${escapeHtml(category)}:</strong> ${escapeHtml(names)}</p>`;
    })
    .join("");
}

function renderProjects(projects) {
  return projects
    .map(
      (project) => `
        <article class="item">
          <div class="item-head">
            <h3>${escapeHtml(project.name)}</h3>
            <a href="${escapeHtml(project.live)}">${escapeHtml(project.live)}</a>
          </div>
          <p>${escapeHtml(project.description)}</p>
          <p class="meta">${escapeHtml(project.stack.join(" | "))}</p>
        </article>
      `,
    )
    .join("");
}

function renderEducation(education) {
  return education
    .map(
      (item) => `
        <article class="item compact">
          <div class="item-head">
            <h3>${escapeHtml(item.degree)}</h3>
            <span>${escapeHtml(item.year)}</span>
          </div>
          <p><strong>${escapeHtml(item.institute)}</strong></p>
          <p>${escapeHtml(item.details)}</p>
        </article>
      `,
    )
    .join("");
}

function renderExperiences(experiences) {
  return experiences
    .map(
      (item) => `
        <article class="item compact">
          <div class="item-head">
            <h3>${escapeHtml(item.role)}</h3>
            <span>${escapeHtml(item.duration)}</span>
          </div>
          <p><strong>${escapeHtml(item.company)}</strong></p>
          <p>${escapeHtml(item.description)}</p>
        </article>
      `,
    )
    .join("");
}

function buildHtml({ profile, links, skills, projects, education, experiences }) {
  const title = `${profile.name} - Resume`;
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(title)}</title>
    <style>
      @page {
        size: A4;
        margin: 13mm;
      }

      * {
        box-sizing: border-box;
      }

      body {
        margin: 0;
        color: #172033;
        background: #ffffff;
        font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;
        font-size: 10.5px;
        line-height: 1.45;
      }

      a {
        color: #0f766e;
        text-decoration: none;
      }

      .page {
        max-width: 794px;
        margin: 0 auto;
        display: grid;
        grid-template-columns: 178px 1fr;
        min-height: 100vh;
      }

      .header {
        grid-column: 1 / -1;
        display: grid;
        grid-template-columns: 178px 1fr;
        color: #f8fafc;
        background: #252a31;
        border-bottom: 5px solid #f59e0b;
      }

      h1,
      h2,
      h3,
      p {
        margin: 0;
      }

      h1 {
        color: #ffffff;
        font-size: 30px;
        line-height: 1;
        letter-spacing: -0.04em;
      }

      .role {
        margin-top: 6px;
        color: #f8fafc;
        letter-spacing: 0.2em;
        font-size: 12px;
        font-weight: 800;
      }

      .summary {
        margin-top: 10px;
        max-width: 560px;
        color: #d7dce2;
      }

      .contact {
        display: grid;
        gap: 4px;
        min-width: 220px;
        color: #ecfeff;
        text-align: right;
        font-size: 9.8px;
      }

      .sidebar {
        background: #252a31;
        color: #ffffff;
        padding: 16px 18px 24px;
      }

      .portrait {
        height: 130px;
        margin-bottom: 20px;
        background: linear-gradient(135deg, #e5e7eb, #f8fafc);
        color: #252a31;
        display: grid;
        place-items: center;
        font-size: 34px;
        font-weight: 900;
      }

      .main {
        padding: 18px 20px 24px;
      }

      .header .sidebar {
        padding-bottom: 0;
      }

      .header-main {
        padding: 26px 22px 28px;
      }

      .section {
        margin-top: 13px;
      }

      h2 {
        display: flex;
        align-items: center;
        gap: 9px;
        color: #0f172a;
        font-size: 12px;
        letter-spacing: 0.14em;
        text-transform: uppercase;
      }

      .sidebar h2,
      .sidebar a,
      .sidebar p,
      .sidebar span {
        color: #ffffff;
      }

      .sidebar h2::after {
        background: #f59e0b;
      }

      h2::after {
        content: "";
        height: 1px;
        flex: 1;
        background: #cbd5e1;
      }

      .grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
      }

      .item {
        margin-top: 8px;
        padding-left: 10px;
        border-left: 3px solid #f59e0b;
      }

      .item.compact {
        break-inside: avoid;
      }

      .item-head {
        display: flex;
        justify-content: space-between;
        gap: 12px;
        align-items: baseline;
      }

      h3 {
        color: #0f172a;
        font-size: 11.5px;
      }

      .item-head span,
      .item-head a,
      .meta {
        color: #475569;
        font-size: 9.5px;
        font-weight: 700;
      }

      .item p {
        margin-top: 3px;
        color: #334155;
      }

      .skills {
        margin-top: 8px;
        display: grid;
        gap: 4px;
      }

      .skills strong {
        color: #0f172a;
      }

      .chips {
        display: flex;
        flex-wrap: wrap;
        gap: 5px;
        margin-top: 8px;
      }

      .chip {
        padding: 3px 7px;
        border: 1px solid #fed7aa;
        border-radius: 999px;
        background: #fff7ed;
        color: #9a3412;
        font-size: 9px;
        font-weight: 800;
      }
    </style>
  </head>
  <body>
    <main class="page">
      <header class="header">
        <div class="sidebar">
          <div class="portrait">${escapeHtml(profile.name.split(" ").map((part) => part[0]).join(""))}</div>
        </div>
        <div class="header-main">
          <h1>${escapeHtml(profile.name)}</h1>
          <p class="role">${escapeHtml(profile.designation)}</p>
          <p class="summary">${escapeHtml(profile.intro)} ${escapeHtml(profile.journey)}</p>
        </div>
      </header>

      <aside class="sidebar">
        <section class="section">
          <h2>Contact Me</h2>
          <address class="contact">
          <span>${escapeHtml(profile.location)}</span>
          <a href="mailto:${escapeHtml(profile.email)}">${escapeHtml(profile.email)}</a>
          <a href="tel:${escapeHtml(profile.phone)}">${escapeHtml(profile.phone)}</a>
          <a href="${escapeHtml(links.github)}">${escapeHtml(links.github.replace("https://", ""))}</a>
          <a href="${escapeHtml(links.linkedin)}">${escapeHtml(links.linkedin.replace("https://", ""))}</a>
          <a href="${escapeHtml(links.codeforces)}">${escapeHtml(links.codeforces.replace("https://", ""))}</a>
          </address>
        </section>
      </aside>

      <div class="main">
        <section class="section">
        <h2>Technical Skills</h2>
        <div class="skills">${listSkills(skills)}</div>
        <div class="chips">
          <span class="chip">Responsive UI</span>
          <span class="chip">React Components</span>
          <span class="chip">API Handling</span>
          <span class="chip">Problem Solving</span>
          <span class="chip">Clean Layouts</span>
        </div>
      </section>

      <section class="section">
        <h2>Experience</h2>
        ${renderExperiences(experiences)}
      </section>

      <section class="section">
        <h2>Projects</h2>
        ${renderProjects(projects)}
      </section>

      <section class="section grid">
        <div>
          <h2>Education</h2>
          ${renderEducation(education)}
        </div>
        <div>
          <h2>Profile</h2>
          <article class="item compact">
            <p>${escapeHtml(profile.interests)}</p>
            <p>${escapeHtml(profile.outsideProgramming)}</p>
          </article>
        </div>
      </section>
      </div>
    </main>
  </body>
</html>`;
}

function pdfEscape(value = "") {
  return String(value).replaceAll("\\", "\\\\").replaceAll("(", "\\(").replaceAll(")", "\\)");
}

function wrapText(text, maxChars) {
  const words = String(text).split(/\s+/).filter(Boolean);
  const lines = [];
  let line = "";

  words.forEach((word) => {
    const next = line ? `${line} ${word}` : word;
    if (next.length > maxChars && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  });

  if (line) lines.push(line);
  return lines;
}

function createResumePdf({ profile, links, skills, projects, education, experiences }) {
  const width = 595.28;
  const height = 841.89;
  const margin = 36;
  const commands = [];

  const colors = {
    dark: "0.14 0.16 0.19",
    darkSoft: "0.18 0.20 0.24",
    orange: "0.94 0.57 0.04",
    text: "0.18 0.19 0.21",
    muted: "0.35 0.38 0.42",
    light: "0.95 0.96 0.97",
    white: "1 1 1",
    softWhite: "0.88 0.90 0.92",
  };

  const textAt = (value, x, y, fontSize = 9, font = "F1", color = colors.text) => {
    commands.push(`${color} rg BT /${font} ${fontSize} Tf ${x.toFixed(2)} ${y.toFixed(2)} Td (${pdfEscape(value)}) Tj ET`);
  };

  const line = (x1, y1, x2, y2, color = colors.orange, widthValue = 1) => {
    commands.push(`${widthValue} w ${color} RG ${x1} ${y1.toFixed(2)} m ${x2} ${y2.toFixed(2)} l S`);
  };

  const fillRect = (x, rectY, rectWidth, rectHeight, color) => {
    commands.push(`${color} rg ${x} ${rectY.toFixed(2)} ${rectWidth} ${rectHeight} re f`);
  };

  const circle = (x, y, radius, color) => {
    const c = 0.5522847498 * radius;
    commands.push(
      `${color} rg ${x} ${(y + radius).toFixed(2)} m ${(x + c).toFixed(2)} ${(y + radius).toFixed(2)} ${(x + radius).toFixed(2)} ${(y + c).toFixed(2)} ${(x + radius).toFixed(2)} ${y.toFixed(2)} c ${(x + radius).toFixed(2)} ${(y - c).toFixed(2)} ${(x + c).toFixed(2)} ${(y - radius).toFixed(2)} ${x} ${(y - radius).toFixed(2)} c ${(x - c).toFixed(2)} ${(y - radius).toFixed(2)} ${(x - radius).toFixed(2)} ${(y - c).toFixed(2)} ${(x - radius).toFixed(2)} ${y.toFixed(2)} c ${(x - radius).toFixed(2)} ${(y + c).toFixed(2)} ${(x - c).toFixed(2)} ${(y + radius).toFixed(2)} ${x} ${(y + radius).toFixed(2)} c f`,
    );
  };

  const paragraph = ({ value, x, y, maxChars, fontSize = 8.2, leading = 10, color = colors.text, font = "F1", bottom = margin, maxLines = 999 }) => {
    const lines = wrapText(value, maxChars);
    let currentY = y;
    let printed = 0;

    for (const part of lines) {
      if (printed >= maxLines || currentY < bottom) {
        textAt("...", x, Math.max(currentY, bottom), fontSize, font, color);
        return currentY - leading;
      }
      textAt(part, x, currentY, fontSize, font, color);
      currentY -= leading;
      printed += 1;
    }

    return currentY;
  };

  const sectionTitle = (title, x, y, color = colors.text) => {
    textAt(title.toUpperCase(), x, y, 11, "F2", color);
    return y - 18;
  };

  const bullet = ({ value, x, y, maxChars, color = colors.text, bulletColor = colors.orange, bottom = margin, fontSize = 7.6 }) => {
    circle(x + 3, y + 2, 2, bulletColor);
    return paragraph({ value, x: x + 10, y, maxChars, fontSize, leading: 9, color, bottom, maxLines: 3 });
  };

  const sidebarX = 22;
  const sidebarW = 172;
  const sidebarTop = 802;
  const sidebarBottom = 326;
  const mainX = 218;
  const mainW = width - mainX - margin;
  const rightMaxChars = 60;

  fillRect(0, 0, width, height, colors.white);
  fillRect(sidebarX, sidebarBottom, sidebarW, sidebarTop - sidebarBottom, colors.dark);
  fillRect(0, 518, width, 5, colors.orange);
  fillRect(36, 666, 128, 112, colors.light);
  fillRect(43, 673, 114, 98, colors.softWhite);
  textAt(profile.name.split(" ").map((part) => part[0]).join(""), 82, 718, 34, "F2", colors.dark);

  textAt(profile.name.toUpperCase(), mainX, 744, 26, "F2", colors.white);
  textAt(profile.designation.toUpperCase(), mainX + 2, 727, 8.5, "F1", colors.softWhite);
  line(mainX, 715, mainX + 130, 715, colors.orange, 2);
  textAt("ABOUT ME", mainX, 690, 10.5, "F2", colors.white);
  paragraph({
    value: profile.intro,
    x: mainX,
    y: 674,
    maxChars: 62,
    fontSize: 7.5,
    leading: 9,
    color: colors.softWhite,
    bottom: 540,
    maxLines: 9,
  });

  let leftY = 480;
  leftY = sectionTitle("Contact Me", 42, leftY, colors.white);
  [
    profile.phone,
    profile.email,
    links.github.replace("https://", ""),
    profile.location,
  ].forEach((item) => {
    circle(43, leftY + 2, 3, colors.orange);
    leftY = paragraph({ value: item, x: 54, y: leftY, maxChars: 27, fontSize: 7, leading: 8.8, color: colors.white, bottom: sidebarBottom + 20, maxLines: 2 });
    leftY -= 4;
  });

  leftY = 284;
  leftY = sectionTitle("Education", 42, leftY);
  education.forEach((item) => {
    if (leftY < 92) return;
    textAt(item.institute, 42, leftY, 7.9, "F2", colors.text);
    leftY -= 9;
    leftY = paragraph({ value: `${item.degree} | ${item.year}`, x: 42, y: leftY, maxChars: 29, fontSize: 7, leading: 8.5, color: colors.muted, bottom: 76, maxLines: 3 });
    leftY -= 7;
  });

  leftY -= 4;
  leftY = sectionTitle("References", 42, leftY);
  textAt("Available on request", 42, leftY, 7.6, "F2", colors.text);
  leftY -= 10;
  textAt(`Email: ${profile.email}`, 42, leftY, 7, "F1", colors.muted);

  let mainY = 484;
  mainY = sectionTitle("Work Experience", mainX, mainY);
  experiences.forEach((item) => {
    if (mainY < 358) return;
    textAt(item.company, mainX, mainY, 9.5, "F2", colors.text);
    mainY -= 10;
    textAt(item.duration, mainX, mainY, 7.2, "F2", colors.muted);
    mainY -= 10;
    textAt(item.role, mainX, mainY, 7.8, "F1", colors.text);
    mainY -= 11;
    mainY = bullet({ value: item.description, x: mainX, y: mainY, maxChars: rightMaxChars, bottom: 340 });
    mainY -= 10;
  });

  projects.forEach((project) => {
    if (mainY < 190) return;
    textAt(project.name, mainX, mainY, 9.5, "F2", colors.text);
    mainY -= 10;
    textAt(project.stack.join(", "), mainX, mainY, 7.2, "F2", colors.muted);
    mainY -= 10;
    mainY = bullet({ value: project.short, x: mainX, y: mainY, maxChars: rightMaxChars, bottom: 178 });
    mainY = bullet({ value: project.challenges, x: mainX, y: mainY, maxChars: rightMaxChars, bottom: 178 });
    mainY -= 8;
  });

  mainY = Math.max(mainY, 128);
  mainY = sectionTitle("Skills", mainX, mainY);
  Object.entries(skills).forEach(([, items]) => {
    items.forEach((item) => {
      if (mainY < 42) return;
      mainY = bullet({ value: item.name, x: mainX, y: mainY, maxChars: 32, bottom: 38, fontSize: 7.6 });
    });
  });

  const stream = commands.join("\n");
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${width} ${height}] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>`,
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>",
    `<< /Length ${Buffer.byteLength(stream)} >>\nstream\n${stream}\nendstream`,
  ];

  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  objects.forEach((object, index) => {
    offsets.push(Buffer.byteLength(pdf));
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });

  const xrefOffset = Buffer.byteLength(pdf);
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  offsets.slice(1).forEach((offset) => {
    pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
  });
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
  return pdf;
}

const data = {
  profile: await readJson("profile.json"),
  links: await readJson("links.json"),
  skills: await readJson("skills.json"),
  projects: await readJson("projects.json"),
  education: await readJson("education.json"),
  experiences: await readJson("experiences.json"),
};

const htmlPath = path.join(publicDir, "resume.html");
const pdfPath = path.join(publicDir, "resume.pdf");

await writeFile(htmlPath, buildHtml(data), "utf8");
await writeFile(pdfPath, createResumePdf(data), "binary");

console.log(`Resume HTML: ${htmlPath}`);
console.log(`Resume PDF: ${pdfPath}`);
