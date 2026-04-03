// lib/pdf-extract-real.ts
import * as pdfjsLib from 'pdfjs-dist';

// Configuration pour PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export async function extractRealProductsFromPDF(file: File): Promise<{ product_name: string }[]> {
  try {
    console.log('🔍 Début extraction RÉELLE avec PDF.js...');
    
    // Convertir le fichier en ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    
    // Charger le PDF avec PDF.js
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    console.log(`📄 PDF chargé: ${pdf.numPages} pages`);
    
    let fullText = '';
    
    // Extraire le texte de chaque page
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item: any) => item.str).join(' ');
      fullText += pageText + '\n';
    }
    
    console.log('✅ Texte extrait avec PDF.js:', fullText.length, 'caractères');
    
    // Extraire les produits EXACTS du texte
    const products = extractExactProducts(fullText);
    
    console.log(`🎯 ${products.length} produits EXACTS trouvés`);
    return products;
    
  } catch (error) {
    console.error('❌ Erreur extraction PDF.js:', error);
    throw new Error('Échec de l\'extraction PDF');
  }
}

// Extraire les produits EXACTS du texte
function extractExactProducts(text: string): { product_name: string }[] {
  const products: { product_name: string }[] = [];
  const seen = new Set<string>();
  
  console.log('🎯 Recherche des produits EXACTS...');
  
  // Diviser le texte en lignes
  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 5);
  
  // Analyser chaque ligne pour trouver les produits
  for (const line of lines) {
    const product = extractProductFromLine(line);
    if (product && !seen.has(product)) {
      seen.add(product);
      products.push({ product_name: product });
      
      // Afficher les premiers produits
      if (products.length <= 20) {
        console.log(`📦 ${products.length}. ${product}`);
      }
    }
  }
  
  console.log(`✅ ${products.length} produits uniques trouvés`);
  return products;
}

// Extraire un produit d'une ligne spécifique
function extractProductFromLine(line: string): string | null {
  // Nettoyer la ligne
  const cleanLine = line.replace(/\s+/g, ' ').trim();
  
  // PATTERN 1: Format tabulaire avec prix et date
  // "ACEPRAL CARDIO-100 MG B/30 72,28 30 06/2025"
  const tabularPattern = /^([A-Z][A-Za-zÀ-ÿ\s\-\.\(\)\/0-9]{10,}?)(?:\s+[\d\s,.]+\s+\d+\s+\d{2}\/\d{4})/;
  const tabularMatch = cleanLine.match(tabularPattern);
  if (tabularMatch && tabularMatch[1]) {
    const product = cleanProductName(tabularMatch[1]);
    if (isValidRealProduct(product)) return product;
  }
  
  // PATTERN 2: Lignes qui commencent par des noms de médicaments connus
  const knownStarts = [
    'ACEPRAL', 'ATOR', 'ADAFERIN', 'ADEX', 'ADVITAM', 'AKARYD', 'ALERFENE', 
    'ALGIFEN', 'ALLERTINE', 'AMBROXOL', 'AMIKOZ', 'AMLODIPINE', 'AMLOR',
    'AMOCLAN', 'ANCEFAL', 'ANDROCUR', 'ANTAG', 'ANTALFEN', 'APROSART',
    'APROVASC', 'ARADEX', 'AROVAN', 'ASPEC', 'ASPEGIC', 'BETABIO', 'BETACROVIS',
    'BETAMETHASONE', 'BIAFCURE', 'BIOCLAV', 'BIOFENAC', 'BIOPAMOX', 'BIPROTENS',
    'BISOPROLOL', 'BLOPRESS', 'BONACOR', 'BREQUAL', 'BRONCHOCURE', 'CALCIDOSE'
  ];
  
  for (const start of knownStarts) {
    if (cleanLine.toUpperCase().startsWith(start)) {
      // Prendre le début de la ligne jusqu'au premier nombre (prix)
      const productPart = cleanLine.split(/\s+\d/)[0] || cleanLine;
      const product = cleanProductName(productPart);
      if (isValidRealProduct(product)) return product;
    }
  }
  
  // PATTERN 3: Lignes avec format médicament (texte + dosage)
  const medicinePattern = /^([A-Z][A-Za-zÀ-ÿ\s\-\.\(\)\/0-9]{15,}?(?=\s+[\d,]|$))/;
  const medicineMatch = cleanLine.match(medicinePattern);
  if (medicineMatch && medicineMatch[1]) {
    const product = cleanProductName(medicineMatch[1]);
    if (isValidRealProduct(product)) return product;
  }
  
  return null;
}

// Nettoyer le nom du produit (léger)
function cleanProductName(rawName: string): string {
  return rawName
    .replace(/\s+/g, ' ')
    .replace(/\s+\|.*$/, '')
    .replace(/\s+[\d\s,.]+\s+\d+\s+\d{2}\/\d{4}.*$/, '')
    .replace(/^\s+|\s+$/g, '')
    .trim();
}

// Validation STRICTE des produits
function isValidRealProduct(product: string): boolean {
  if (product.length < 8 || product.length > 150) return false;
  if (!/[A-Za-zÀ-ÿ]/.test(product)) return false;
  
  // Doit contenir des termes pharmaceutiques
  const pharmaTerms = ['MG', 'COMP', 'GEL', 'SIROP', 'SOL', 'SUSP', 'CREME', 'POMMADE', 'B/', 'BTE', 'FL', 'T/', 'SACHET', 'SUPPO', 'GLES', 'CP'];
  const hasPharmaTerm = pharmaTerms.some(term => product.toUpperCase().includes(term));
  if (!hasPharmaTerm) return false;
  
  // Exclure les en-têtes
  const excluded = [
    'PRODUIT', 'P.VENTE', 'TX%', 'EXP', 'LogiPharm', 
    'Date impression', 'LISTE DES PRODUITS', 'N° Page', 'Tél'
  ];
  
  return !excluded.some(term => product.toUpperCase().includes(term));
}