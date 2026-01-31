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

    test('does not match invalid hex colors', () => {
      expect('#gg'.match(CSS_PATTERNS.hexColor)).toBeNull();
      expect('#12'.match(CSS_PATTERNS.hexColor)).toBeNull();
      expect('#ghijkl'.match(CSS_PATTERNS.hexColor)).toBeNull();
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

    test('does not match invalid rgb colors', () => {
      expect('rgb(abc, def, ghi)'.match(CSS_PATTERNS.rgbColor)).toBeNull();
      expect('rgb(255)'.match(CSS_PATTERNS.rgbColor)).toBeNull();
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

    test('does not match invalid hsl colors', () => {
      expect('hsl(abc, def, ghi)'.match(CSS_PATTERNS.hslColor)).toBeNull();
      expect('hsl(120)'.match(CSS_PATTERNS.hslColor)).toBeNull();
    });
  });

  describe('spacingPx', () => {
    test('matches width with px values', () => {
      expect('width: 8px'.match(CSS_PATTERNS.spacingPx)).toEqual([
        'width: 8px',
      ]);
    });

    test('matches height with rem values', () => {
      expect('height: 1rem'.match(CSS_PATTERNS.spacingPx)).toEqual([
        'height: 1rem',
      ]);
    });

    test('matches gap with multiple values', () => {
      expect('gap: 8px 16px'.match(CSS_PATTERNS.spacingPx)).toEqual([
        'gap: 8px 16px',
      ]);
    });

    test('does not match padding or margin (handled by spacingShorthand)', () => {
      expect('padding: 8px'.match(CSS_PATTERNS.spacingPx)).toBeNull();
      expect('margin: 1rem'.match(CSS_PATTERNS.spacingPx)).toBeNull();
    });

    test('does not match invalid spacing values', () => {
      expect('width: auto'.match(CSS_PATTERNS.spacingPx)).toBeNull();
      expect('height: inherit'.match(CSS_PATTERNS.spacingPx)).toBeNull();
    });
  });

  describe('spacingShorthand', () => {
    test('matches padding with single value', () => {
      expect('padding: 8px'.match(CSS_PATTERNS.spacingShorthand)).toEqual([
        'padding: 8px',
      ]);
    });

    test('matches margin with single value', () => {
      expect('margin: 1rem'.match(CSS_PATTERNS.spacingShorthand)).toEqual([
        'margin: 1rem',
      ]);
    });

    test('matches padding shorthand with 2 values', () => {
      expect('padding: 8px 16px'.match(CSS_PATTERNS.spacingShorthand)).toEqual([
        'padding: 8px 16px',
      ]);
    });

    test('matches margin shorthand with 4 values', () => {
      expect(
        'margin: 8px 16px 8px 16px'.match(CSS_PATTERNS.spacingShorthand),
      ).toEqual(['margin: 8px 16px 8px 16px']);
    });

    test('matches padding shorthand with 3 values', () => {
      expect(
        'padding: 8px 16px 8px'.match(CSS_PATTERNS.spacingShorthand),
      ).toEqual(['padding: 8px 16px 8px']);
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

    test('does not match invalid font-size values', () => {
      expect('font-size: inherit'.match(CSS_PATTERNS.fontSize)).toBeNull();
      expect('font-size: large'.match(CSS_PATTERNS.fontSize)).toBeNull();
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

    test('does not match invalid font weight values', () => {
      expect('font-weight: bold'.match(CSS_PATTERNS.fontWeight)).toBeNull();
      expect('font-weight: normal'.match(CSS_PATTERNS.fontWeight)).toBeNull();
      expect('font-weight: 50'.match(CSS_PATTERNS.fontWeight)).toBeNull();
    });
  });

  describe('lineHeightPx', () => {
    test('matches line-height with px', () => {
      expect('line-height: 24px'.match(CSS_PATTERNS.lineHeightPx)).toEqual([
        'line-height: 24px',
      ]);
    });

    test('matches line-height with rem', () => {
      expect('line-height: 1.5rem'.match(CSS_PATTERNS.lineHeightPx)).toEqual([
        'line-height: 1.5rem',
      ]);
    });

    test('matches line-height with em', () => {
      expect('line-height: 1.2em'.match(CSS_PATTERNS.lineHeightPx)).toEqual([
        'line-height: 1.2em',
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

    test('does not match invalid border-radius values', () => {
      expect(
        'border-radius: inherit'.match(CSS_PATTERNS.borderRadius),
      ).toBeNull();
    });
  });

  describe('borderWidth', () => {
    test('matches border-width with px', () => {
      expect('border-width: 2px'.match(CSS_PATTERNS.borderWidth)).toEqual([
        'border-width: 2px',
      ]);
    });

    test('matches border-top-width with px', () => {
      expect('border-top-width: 1px'.match(CSS_PATTERNS.borderWidth)).toEqual([
        'border-top-width: 1px',
      ]);
    });

    test('matches border-left with px', () => {
      expect('border-left: 2px'.match(CSS_PATTERNS.borderWidth)).toEqual([
        'border-left: 2px',
      ]);
    });
  });

  describe('borderFull', () => {
    test('matches border with px and hex color', () => {
      expect('border: 2px solid #fff'.match(CSS_PATTERNS.borderFull)).toEqual([
        'border: 2px solid #fff',
      ]);
    });

    test('matches border-top with px and hex color', () => {
      expect(
        'border-top: 1px dashed #000000'.match(CSS_PATTERNS.borderFull),
      ).toEqual(['border-top: 1px dashed #000000']);
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

    test('does not match box-shadow without color', () => {
      expect('box-shadow: none'.match(CSS_PATTERNS.boxShadow)).toBeNull();
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

    test('does not match outline without size', () => {
      expect('outline: none'.match(CSS_PATTERNS.outlineWidth)).toBeNull();
    });
  });

  describe('outlineFull', () => {
    test('matches outline with px and hex color', () => {
      expect('outline: 2px solid #fff'.match(CSS_PATTERNS.outlineFull)).toEqual(
        ['outline: 2px solid #fff'],
      );
    });

    test('matches outline with px and rgba color', () => {
      expect(
        'outline: 1px dashed rgba(0, 0, 0, 0.5)'.match(
          CSS_PATTERNS.outlineFull,
        ),
      ).toEqual(['outline: 1px dashed rgba(0, 0, 0, 0.5)']);
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
