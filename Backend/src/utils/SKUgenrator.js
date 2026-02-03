import base62 from "base62"
const normalizePart = (text, length = 3) => {
  return text
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .padEnd(length, "X")
    .slice(0, length);
};

const toMinBase64 = (counter)=>{
        const id =  base62.encode(counter);
        return id.length < 3 ? id.padStart(3,"X"): id;
}

export const SKUgenrator = ({name, brand, nextSeq})=>{
            const productPart = normalizePart(name,3)
            const brandPart = normalizePart(brand,3)
            const uniquePart = toMinBase64(nextSeq);
            
            return `${productPart}-${brandPart}-${uniquePart}`;
}