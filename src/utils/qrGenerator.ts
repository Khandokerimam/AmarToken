/**
 * Crisp SVG QR Code and Barcode Generator for University Meal Tokens
 * Generates deterministic 2D matrix patterns from token hash and serial
 */

function simpleHash(str: string): number[] {
  const bytes: number[] = [];
  for (let i = 0; i < str.length; i++) {
    bytes.push(str.charCodeAt(i));
  }
  // Fill to 64 bytes using simple pseudo-random expansion
  let seed = 0x811c9dc5;
  for (let i = 0; i < bytes.length; i++) {
    seed = (seed ^ bytes[i]) * 0x01000193;
  }
  const result: number[] = [];
  for (let i = 0; i < 64; i++) {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    result.push(seed % 256);
  }
  return result;
}

export function generateTokenMatrix(dataString: string, size: number = 25): boolean[][] {
  const matrix: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false));
  const hash = simpleHash(dataString);

  // 1. Finder patterns (standard 7x7 corner squares at top-left, top-right, bottom-left)
  function drawFinderPattern(startX: number, startY: number) {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        if (
          r === 0 ||
          r === 6 ||
          c === 0 ||
          c === 6 ||
          (r >= 2 && r <= 4 && c >= 2 && c <= 4)
        ) {
          matrix[startY + r][startX + c] = true;
        } else {
          matrix[startY + r][startX + c] = false;
        }
      }
    }
  }

  drawFinderPattern(0, 0); // Top-left
  drawFinderPattern(size - 7, 0); // Top-right
  drawFinderPattern(0, size - 7); // Bottom-left

  // Timing patterns (row 6 and col 6 alternating)
  for (let i = 8; i < size - 8; i++) {
    matrix[6][i] = i % 2 === 0;
    matrix[i][6] = i % 2 === 0;
  }

  // Data fill with hash bits
  let bitIndex = 0;
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      // Skip finder patterns + separators
      const inTopLeft = r < 8 && c < 8;
      const inTopRight = r < 8 && c >= size - 8;
      const inBottomLeft = r >= size - 8 && c < 8;
      const inTiming = r === 6 || c === 6;

      if (!inTopLeft && !inTopRight && !inBottomLeft && !inTiming) {
        const byte = hash[bitIndex % hash.length];
        const bit = (byte >> (bitIndex % 8)) & 1;
        matrix[r][c] = bit === 1;
        bitIndex++;
      }
    }
  }

  return matrix;
}

export function generateBarcodeBars(tokenNumber: string): { width: number; isBlack: boolean }[] {
  const bars: { width: number; isBlack: boolean }[] = [];
  // Start guard
  bars.push({ width: 2, isBlack: true });
  bars.push({ width: 1, isBlack: false });
  bars.push({ width: 2, isBlack: true });
  bars.push({ width: 1, isBlack: false });

  for (let i = 0; i < tokenNumber.length; i++) {
    const code = tokenNumber.charCodeAt(i);
    const w1 = (code % 3) + 1;
    const w2 = ((code >> 1) % 2) + 1;
    const w3 = ((code >> 2) % 3) + 1;
    bars.push({ width: w1, isBlack: true });
    bars.push({ width: 1, isBlack: false });
    bars.push({ width: w2, isBlack: true });
    bars.push({ width: w3, isBlack: false });
  }

  // Stop guard
  bars.push({ width: 2, isBlack: true });
  bars.push({ width: 1, isBlack: false });
  bars.push({ width: 2, isBlack: true });

  return bars;
}
