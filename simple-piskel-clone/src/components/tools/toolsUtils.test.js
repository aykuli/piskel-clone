import { RGBToHex,penSizeHandler } from './toolsUtils';

describe('RGBToHex function', () => {
  it('Black color data', () => {
    const data = Uint8ClampedArray.from([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    expect(RGBToHex(data)).toBe('#000000');
  });
  it('Blue color data', () => {
    const data = Uint8ClampedArray.from([13,15,242,255,15,15,240,255,18,15,237,255,20,15,235,255,23,15,232,255,26,15,230,255,28,15,227,255,31,15,224,255,33,15,222,255,36,15,219,255,38,15,217,255,41,15,214,255,43,15,212,255,46,15,209,255,48,15,207,255,51,15,204,255,54,15,201,255,56,15,199,255,59,15,196,255,61,15,194,255,64,15,191,255,13,18,242,255,15,18,240,255,18,18,237,255,20,18,235,255,23,18,232,255,26,18,230,255,28,18,227,255,31,18,224,255,33,18,222,255,36,18,219,255,38,18,217,255,41,18,214,255,43,18,212,255,46,18,209,255,48,18,207,255,51,18,204,255,54,18,201,255,56,18,199,255,59,18,196,255,61,18,194,255,64,18,191,255,13,20,242,255,15,20,240,255,18,20,237,255,20,20,235,255,23,20,232,255,26,20,230,255,28,20,227,255,31,20,224,255,33,20,222,255,36,20,219,255,38,20,217,255,41,20,214,255,43,20,212,255,46,20,209,255,48,20,207,255,51,20,204,255,54,20,201,255,56,20,199,255,59,20,196,255,61,20,194,255,64,20,191,255,13,23,242,255,15,23,240,255,18,23,237,255,20,23,235,255,23,23,232,255,26,23,230,255,28,23,227,255,31,23,224,255,33,23,222,255,36,23,219,255,38,23,217,255,41,23,214,255,43,23,212,255,46,23,209,255,48,23,207,255,51,23,204,255,54,23,201,255,56,23,199,255,59,23,196,255,61,23,194,255,64,23,191,255,13,26,242,255,15,26,240,255,18,26,237,255,20,26,235,255,23,26,232,255,26,26,230,255,28,26,227,255,31,26,224,255,33,26,222,255,36,26,219,255,38,26,217,255,41,26,214,255,43,26,212,255,46,26,209,255,48,26,207,255,51,26,204,255,54,26,201,255,56,26,199,255,59,26,196,255,61,26,194,255,64,26,191,255,13,28,242,255,15,28,240,255,18,28,237,255,20,28,235,255,23,28,232,255,26,28,230,255,28,28,227,255,31,28,224,255,33,28,222,255,36,28,219,255,38,28,217,255,41,28,214,255,43,28,212,255,46,28,209,255,48,28,207,255,51,28,204,255,54,28,201,255,56,28,199,255,59,28,196,255,61,28,194,255,64,28,191,255,13,31,242,255,15,31,240,255,18,31,237,255,20,31,235,255,23,31,232,255,26,31,230,255,28,31,227,255,31,31,224,255,33,31,222,255,36,31,219,255,38,31,217,255,41,31,214,255,43,31,212,255,46,31,209,255,48,31,207,255,51,31,204,255,54,31,201,255,56,31,199,255,59,31,196,255,61,31,194,255,64,31,191,255,13,33,242,255,15,33,240,255,18,33,237,255,20,33,235,255,23,33,232,255,26,33,230,255,28,33,227,255,31,33,224,255,33,33,222,255,36,33,219,255,38,33,217,255,41,33,214,255,43,33,212,255,46,33,209,255,48,33,207,255,51,33,204,255,54,33,201,255,56,33,199,255,59,33,196,255,61,33,194,255,64,33,191,255,13,36,242,255,15,36,240,255,18,36,237,255,20,36,235,255,23,36,232,255,26,36,230,255,28,36,227,255,31,36,224,255,33,36,222,255,36,36,219,255,38,36,217,255,41,36,214,255,43,36,212,255,46,36,209,255,48,36,207,255,51,36,204,255,54,36,201,255,56,36,199,255,59,36,196,255,61,36,194,255,64,36,191,255,13,38,242,255,15,38,240,255,18,38,237,255,20,38,235,255,23,38,232,255,26,38,230,255,28,38,227,255,31,38,224,255,33,38,222,255,36,38,219,255,38,38,217,255,41,38,214,255,43,38,212,255,46,38,209,255,48,38,207,255,51,38,204,255,54,38,201,255,56,38,199,255,59,38,196,255,61,38,194,255,64,38,191,255,13,41,242,255,15,41,240,255,18,41,237,255,20,41,235,255,23,41,232,255,26,41,230,255,28,41,227,255,31,41,224,255,33,41,222,255,36,41,219,255,38,41,217,255,41,41,214,255,43,41,212,255,46,41,209,255,48,41,207,255,51,41,204,255,54,41,201,255,56,41,199,255,59,41,196,255,61,41,194,255,64,41,191,255,13,43,242,255,15,43,240,255,18,43,237,255,20,43,235,255,23,43,232,255,26,43,230,255,28,43,227,255,31,43,224,255,33,43,222,255,36,43,219,255,38,43,217,255,41,43,214,255,43,43,212,255,46,43,209,255,48,43,207,255,51,43,204,255,54,43,201,255,56,43,199,255,59,43,196,255,61,43,194,255,64,43,191,255,13,46,242,255,15,46,240,255,18,46,237,255,20,46,235,255,23,46,232,255,26,46,230,255,28,46,227,255,31,46,224,255,33,46,222,255,36,46,219,255,38,46,217,255,41,46,214,255,43,46,212,255,46,46,209,255,48,46,207,255,51,46,204,255,54,46,201,255,56,46,199,255,59,46,196,255,61,46,194,255,64,46,191,255,13,48,242,255,15,48,240,255,18,48,237,255,20,48,235,255,23,48,232,255,26,48,230,255,28,48,227,255,31,48,224,255,33,48,222,255,36,48,219,255,38,48,217,255,41,48,214,255,43,48,212,255,46,48,209,255,48,48,207,255,51,48,204,255,54,48,201,255,56,48,199,255,59,48,196,255,61,48,194,255,64,48,191,255,13,51,242,255,15,51,240,255,18,51,237,255,20,51,235,255,23,51,232,255,26,51,230,255,28,51,227,255,31,51,224,255,33,51,222,255,36,51,219,255,38,51,217,255,41,51,214,255,43,51,212,255,46,51,209,255,48,51,207,255,51,51,204,255,54,51,201,255,56,51,199,255,59,51,196,255,61,51,194,255,64,51,191,255,13,54,242,255,15,54,240,255,18,54,237,255,20,54,235,255,23,54,232,255,26,54,230,255,28,54,227,255,31,54,224,255,33,54,222,255,36,54,219,255,38,54,217,255,41,54,214,255,43,54,212,255,46,54,209,255,48,54,207,255,51,54,204,255,54,54,201,255,56,54,199,255,59,54,196,255,61,54,194,255,64,54,191,255,13,56,242,255,15,56,240,255,18,56,237,255,20,56,235,255,23,56,232,255,26,56,230,255,28,56,227,255,31,56,224,255,33,56,222,255,36,56,219,255,38,56,217,255,41,56,214,255,43,56,212,255,46,56,209,255,48,56,207,255,51,56,204,255,54,56,201,255,56,56,199,255,59,56,196,255,61,56,194,255,64,56,191,255,13,59,242,255,15,59,240,255,18,59,237,255,20,59,235,255,23,59,232,255,26,59,230,255,28,59,227,255,31,59,224,255,33,59,222,255,36,59,219,255,38,59,217,255,41,59,214,255,43,59,212,255,46,59,209,255,48,59,207,255,51,59,204,255,54,59,201,255,56,59,199,255,59,59,196,255,61,59,194,255,64,59,191,255,13,61,242,255,15,61,240,255,18,61,237,255,20,61,235,255,23,61,232,255,26,61,230,255,28,61,227,255,31,61,224,255,33,61,222,255,36,61,219,255,38,61,217,255,41,61,214,255,43,61,212,255,46,61,209,255,48,61,207,255,51,61,204,255,54,61,201,255,56,61,199,255,59,61,196,255,61,61,194,255,64,61,191,255,13,64,242,255,15,64,240,255,18,64,237,255,20,64,235,255,23,64,232,255,26,64,230,255,28,64,227,255,31,64,224,255,33,64,222,255,36,64,219,255,38,64,217,255,41,64,214,255,43,64,212,255,46,64,209,255,48,64,207,255,51,64,204,255,54,64,201,255,56,64,199,255,59,64,196,255,61,64,194,255,64,64,191,255,13,66,242,255,15,66,240,255,18,66,237,255,20,66,235,255,23,66,232,255,26,66,230,255,28,66,227,255,31,66,224,255,33,66,222,255,36,66,219,255,38,66,217,255,41,66,214,255,43,66,212,255,46,66,209,255,48,66,207,255,51,66,204,255,54,66,201,255,56,66,199,255,59,66,196,255,61,66,194,255,64,66,191,255]);
    expect(RGBToHex(data)).toBe('#0d0ff2');
  });
});

describe('penSizeHandler function', ()=> {
  const e = {target: {tagName:"LI", dataset: {size: 4}}};
  const penSize = 1;
  const highlightTarget = () => {};
  const refreshLocalStorageValue = () => {};
  const getDomElement = 0;
  
  expect(penSizeHandler(e, penSize, highlightTarget, refreshLocalStorageValue, getDomElement)).toBe(4)
})