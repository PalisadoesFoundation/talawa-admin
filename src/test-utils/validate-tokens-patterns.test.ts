import { describe, expect, test } from 'vitest';

import { CSS_PATTERNS, TSX_PATTERNS } from '../../scripts/validate-tokens';

describe('CSS_PATTERNS', () => {
  describe('hexColor', () => {
    test('matches 3-digit hex colors', () => {
      expect('#fff'.match(CSS_PATTERNS.hexColor)).toEqual(['#fff']);
      expect('#abc'.match(CSS_PATTERNS.hexColor)).toEqual(['#abc']);
    });

    test('matches 6-digit hex colors', () => {
      expect('#ffffff'.match(CSS_PATTERNS.hexColor)).toEqual(['#ffffff']);
      expect('#123abc'.match(CSS_PATTERNS.hexColor)).toEqual(['#123abc']);
    });

    test('matches 8-digit hex colors with alpha', () => {
      expect('#ffffffaa'.match(CSS_PATTERNS.hexColor)).toEqual(['#ffffffaa']);
    });
  });

  describe('rgbColor', () => {
    test('matches rgb colors', () => {
      expect('rgb(255, 255, 255)'.match(CSS_PATTERNS.rgbColor)).toEqual([
        'rgb(255, 255, 255)',
      ]);
    });

    test('matches rgba colors', () => {
      expect('rgba(0, 0, 0, 0.5)'.match(CSS_PATTERNS.rgbColor)).toEqual([
        'rgba(0, 0, 0, 0.5)',
      ]);
    });
  });

  describe('hslColor', () => {
    test('matches hsl colors', () => {
      expect('hsl(120, 50%, 50%)'.match(CSS_PATTERNS.hslColor)).toEqual([
        'hsl(120, 50%, 50%)',
      ]);
    });

    test('matches hsla colors', () => {
      expect('hsla(120, 50%, 50%, 0.5)'.match(CSS_PATTERNS.hslColor)).toEqual([
        'hsla(120, 50%, 50%, 0.5)',
      ]);
    });
  });

  describe('spacingPx', () => {
    test('matches padding with px values', () => {
      expect('padding: 8px'.match(CSS_PATTERNS.spacingPx)).toEqual([
        'padding: 8px',
      ]);
    });

    test('matches margin with rem values', () => {
      expect('margin: 1rem'.match(CSS_PATTERNS.spacingPx)).toEqual([
        'margin: 1rem',
      ]);
    });

    test('matches multiple values', () => {
      expect('padding: 8px 16px'.match(CSS_PATTERNS.spacingPx)).toEqual([
        'padding: 8px 16px',
      ]);
    });
  });

  describe('fontSize', () => {
    test('matches font-size with px', () => {
      expect('font-size: 16px'.match(CSS_PATTERNS.fontSize)).toEqual([
        'font-size: 16px',
      ]);
    });

    test('matches font-size with rem', () => {
      expect('font-size: 1.5rem'.match(CSS_PATTERNS.fontSize)).toEqual([
        'font-size: 1.5rem',
      ]);
    });
  });

  describe('fontWeight', () => {
    test('matches numeric font weights', () => {
      expect('font-weight: 400'.match(CSS_PATTERNS.fontWeight)).toEqual([
        'font-weight: 400',
      ]);
      expect('font-weight: 700'.match(CSS_PATTERNS.fontWeight)).toEqual([
        'font-weight: 700',
      ]);
    });
  });

  describe('borderRadius', () => {
    test('matches border-radius with px', () => {
      expect('border-radius: 4px'.match(CSS_PATTERNS.borderRadius)).toEqual([
        'border-radius: 4px',
      ]);
    });

    test('matches multiple border-radius values', () => {
      expect(
        'border-radius: 4px 8px 4px 8px'.match(CSS_PATTERNS.borderRadius),
      ).toEqual(['border-radius: 4px 8px 4px 8px']);
    });
  });

  describe('boxShadow', () => {
    test('matches box-shadow with hex color', () => {
      const result = 'box-shadow: 2px 4px 8px #000'.match(
        CSS_PATTERNS.boxShadow,
      );
      expect(result).toEqual(['box-shadow: 2px 4px 8px #000']);
    });

    test('matches box-shadow with rgba color', () => {
      const result = 'box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1)'.match(
        CSS_PATTERNS.boxShadow,
      );
      expect(result).toEqual(['box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1)']);
    });
  });

  describe('outlineWidth', () => {
    test('matches outline-width with px', () => {
      expect('outline-width: 2px'.match(CSS_PATTERNS.outlineWidth)).toEqual([
        'outline-width: 2px',
      ]);
    });

    test('matches outline with px', () => {
      expect('outline: 1px'.match(CSS_PATTERNS.outlineWidth)).toEqual([
        'outline: 1px',
      ]);
    });
  });
});

describe('TSX_PATTERNS', () => {
  describe('spacingCamelCase', () => {
    test('matches marginTop with numeric value', () => {
      expect('marginTop: 8'.match(TSX_PATTERNS.spacingCamelCase)).toEqual([
        'marginTop: 8',
      ]);
    });

    test('matches paddingLeft with string px value', () => {
      expect(
        "paddingLeft: '16px'".match(TSX_PATTERNS.spacingCamelCase),
      ).toEqual(["paddingLeft: '16px'"]);
    });

    test('matches marginInline with rem value', () => {
      expect(
        "marginInline: '1rem'".match(TSX_PATTERNS.spacingCamelCase),
      ).toEqual(["marginInline: '1rem'"]);
    });
  });

  describe('dimensionsCamelCase', () => {
    test('matches width with numeric value', () => {
      expect('width: 100'.match(TSX_PATTERNS.dimensionsCamelCase)).toEqual([
        'width: 100',
      ]);
    });

    test('matches height with string px value', () => {
      expect("height: '50px'".match(TSX_PATTERNS.dimensionsCamelCase)).toEqual([
        "height: '50px'",
      ]);
    });

    test('matches gap with rem value', () => {
      expect("gap: '1rem'".match(TSX_PATTERNS.dimensionsCamelCase)).toEqual([
        "gap: '1rem'",
      ]);
    });
  });

  describe('fontSizeCamelCase', () => {
    test('matches fontSize with numeric value', () => {
      expect('fontSize: 16'.match(TSX_PATTERNS.fontSizeCamelCase)).toEqual([
        'fontSize: 16',
      ]);
    });

    test('matches fontSize with string px value', () => {
      expect("fontSize: '14px'".match(TSX_PATTERNS.fontSizeCamelCase)).toEqual([
        "fontSize: '14px'",
      ]);
    });
  });

  describe('fontWeightCamelCase', () => {
    test('matches fontWeight with numeric value', () => {
      expect('fontWeight: 700'.match(TSX_PATTERNS.fontWeightCamelCase)).toEqual(
        ['fontWeight: 700'],
      );
    });

    test('matches fontWeight with string value', () => {
      expect(
        "fontWeight: '500'".match(TSX_PATTERNS.fontWeightCamelCase),
      ).toEqual(["fontWeight: '500'"]);
    });
  });

  describe('lineHeightCamelCase', () => {
    test('matches lineHeight with px value', () => {
      expect(
        "lineHeight: '24px'".match(TSX_PATTERNS.lineHeightCamelCase),
      ).toEqual(["lineHeight: '24px'"]);
    });

    test('matches lineHeight with rem value', () => {
      expect(
        "lineHeight: '1.5rem'".match(TSX_PATTERNS.lineHeightCamelCase),
      ).toEqual(["lineHeight: '1.5rem'"]);
    });
  });

  describe('borderRadiusCamelCase', () => {
    test('matches borderRadius with numeric value', () => {
      expect(
        'borderRadius: 8'.match(TSX_PATTERNS.borderRadiusCamelCase),
      ).toEqual(['borderRadius: 8']);
    });

    test('matches borderRadius with string px value', () => {
      expect(
        "borderRadius: '4px'".match(TSX_PATTERNS.borderRadiusCamelCase),
      ).toEqual(["borderRadius: '4px'"]);
    });
  });

  describe('colorCamelCase', () => {
    test('matches color with hex value', () => {
      expect("color: '#fff'".match(TSX_PATTERNS.colorCamelCase)).toEqual([
        "color: '#fff'",
      ]);
    });

    test('matches backgroundColor with hex value', () => {
      expect(
        "backgroundColor: '#ffffff'".match(TSX_PATTERNS.colorCamelCase),
      ).toEqual(["backgroundColor: '#ffffff'"]);
    });

    test('matches color with rgba value', () => {
      expect(
        "color: 'rgba(0, 0, 0, 0.5)'".match(TSX_PATTERNS.colorCamelCase),
      ).toEqual(["color: 'rgba(0, 0, 0, 0.5)'"]);
    });
  });

  describe('outlineCamelCase', () => {
    test('matches outline with string px value', () => {
      expect("outline: '2px'".match(TSX_PATTERNS.outlineCamelCase)).toEqual([
        "outline: '2px'",
      ]);
    });

    test('matches outlineWidth with numeric value', () => {
      expect('outlineWidth: 1'.match(TSX_PATTERNS.outlineCamelCase)).toEqual([
        'outlineWidth: 1',
      ]);
    });
  });
});
