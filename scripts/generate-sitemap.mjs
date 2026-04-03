import { readFileSync, writeFileSync } from 'fs';

const baseUrl = 'https://komuprzekazac.pl';
const data = JSON.parse(readFileSync('public/data/organizations.json', 'utf-8'));

const CATEGORIES = [
  'sport','niepelnosprawnosc','edukacja','zdrowie','kultura',
  'spoleczenstwo-obywatelskie','pomoc-spoleczna','dzieci-i-rodzina',
  'ratownictwo','zdrowie-psychiczne','zwierzeta','srodowisko',
  'prawa-i-wolnosci','seniorzy','religia','wspolpraca-miedzynarodowa',
  'turystyka','inne'
];

const VOIVODESHIPS = [
  'dolnoslaskie','kujawsko-pomorskie','lubelskie','lubuskie','lodzkie',
  'malopolskie','mazowieckie','opolskie','podkarpackie','podlaskie',
  'pomorskie','slaskie','swietokrzyskie','warminsko-mazurskie',
  'wielkopolskie','zachodniopomorskie'
];

let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

// Static pages
xml += `<url><loc>${baseUrl}</loc><priority>1.0</priority></url>\n`;
xml += `<url><loc>${baseUrl}/szukaj</loc><priority>0.9</priority></url>\n`;
xml += `<url><loc>${baseUrl}/o-serwisie</loc><priority>0.3</priority></url>\n`;

// Categories
for (const cat of CATEGORIES) {
  xml += `<url><loc>${baseUrl}/kategoria/${cat}</loc><priority>0.8</priority></url>\n`;
}

// Voivodeships
for (const v of VOIVODESHIPS) {
  xml += `<url><loc>${baseUrl}/wojewodztwo/${v}</loc><priority>0.7</priority></url>\n`;
}

// Organizations
for (const org of data.organizations) {
  xml += `<url><loc>${baseUrl}/organizacja/${org.slug}</loc><priority>0.6</priority></url>\n`;
}

xml += `</urlset>`;

writeFileSync('public/sitemap.xml', xml);
console.log(`Sitemap generated: ${data.organizations.length + CATEGORIES.length + VOIVODESHIPS.length + 3} URLs`);
