import React, { useEffect, useId, useState } from 'react';
import { Flex, Box, Textarea, Typography } from '@strapi/design-system';

const styles = `
.svgPreviewRoot {
  width: 100%;
}

.svgPreviewLayout {
  width: 100%;
}

.svgPreviewEditor {
  flex: 2;
}

.svgPreviewTextarea {
  font-family: monospace;
  font-size: 12px;
  height: 150px;
  line-height: 1.5;
}

.svgPreviewHelp {
  margin: 0;
  font-size: 12px;
  color: #666;
}

.svgPreviewError {
  margin: 0;
  font-size: 12px;
  color: #d02b20;
}

.svgPreviewSuccess {
  margin: 0;
  font-size: 12px;
  color: #2b8a3e;
}

.svgPreviewCanvas {
  flex: 1;
  min-height: 150px;
  border: 1px dashed #c0c0cf;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f6f6f9;
  padding: 10px;
}

.svgPreviewCanvasSuccess {
  border-color: #2b8a3e;
}

.svgPreviewCanvasError {
  border-color: #d02b20;
}

.svgPreviewFrame {
  width: 100%;
  height: 130px;
  border: 0;
}
`;

const isValidSVGSyntax = (svgString) => {
  if (!svgString.trim().startsWith('<svg')) return false;

  const parser = new DOMParser();
  const doc = parser.parseFromString(svgString, 'image/svg+xml');

  return !doc.querySelector('parsererror');
};

const SvgPreviewInput = ({ attribute, name, value, onChange, disabled, intlLabel }) => {
  const inputId = useId().replace(/:/g, '');
  const previewLabel = intlLabel?.defaultMessage || 'Inline SVG Code';
  const textareaId = `svg-preview-${inputId}`;
  const helpTextId = `svg-preview-${inputId}-help`;

  const [rawSvg, setRawSvg] = useState(value || '');
  const [previewDoc, setPreviewDoc] = useState('');
  const [isValidSvg, setIsValidSvg] = useState(!value || isValidSVGSyntax(value));
  const canvasStateClass = rawSvg.trim().length === 0
    ? ''
    : isValidSvg
      ? ' svgPreviewCanvasSuccess'
      : ' svgPreviewCanvasError';

  useEffect(() => {
    if (rawSvg && isValidSvg) {
      setPreviewDoc(`<!doctype html><html><body>${rawSvg}</body></html>`);
    } else {
      setPreviewDoc('');
    }
  }, [rawSvg, isValidSvg]);

  const handleChange = (event) => {
    const inputValue = event.target.value;
    setRawSvg(inputValue);

    const isEmpty = inputValue.trim().length === 0;
    const nextIsValid = isEmpty || isValidSVGSyntax(inputValue);
    setIsValidSvg(nextIsValid);

    if (!nextIsValid) {
      return;
    }

    onChange({
      target: {
        name,
        value: inputValue,
        type: attribute.type,
      },
    });

  };

  return React.createElement(
    Box,
    { className: 'svgPreviewRoot' },
    React.createElement(
      Flex,
      { direction: 'column', alignItems: 'stretch', gap: 2 },
      React.createElement('style', null, styles),
      React.createElement('label', { htmlFor: textareaId }, previewLabel),
      React.createElement(
        'p',
        { id: helpTextId, className: 'svgPreviewHelp' },
        'Enter raw SVG markup. The preview updates live.'
      ),
      rawSvg.trim().length > 0 &&
        isValidSvg &&
        React.createElement(
          'p',
          { className: 'svgPreviewSuccess', role: 'status' },
          'SVG syntax is valid.'
        ),
      !isValidSvg &&
        React.createElement(
          'p',
          { className: 'svgPreviewError', role: 'alert' },
          'Invalid SVG syntax. Start with <svg ...> and ensure valid XML markup.'
        ),
      React.createElement(
        Flex,
        { gap: 4, alignItems: 'start', className: 'svgPreviewLayout' },
        React.createElement(
          Box,
          { className: 'svgPreviewEditor' },
          React.createElement(Textarea, {
            id: textareaId,
            className: 'svgPreviewTextarea',
            disabled,
            onChange: handleChange,
            value: rawSvg,
            'aria-describedby': helpTextId,
            placeholder: 'Paste <svg>...</svg> code here',
          })
        ),
        React.createElement(
          Box,
          {
            className: `svgPreviewCanvas${canvasStateClass}`,
            role: 'region',
            'aria-label': `${previewLabel} preview`,
          },
          previewDoc
            ? React.createElement('iframe', {
                className: 'svgPreviewFrame',
                srcDoc: previewDoc,
                title: `${previewLabel} preview`,
                sandbox: '',
              })
            : React.createElement(
                Typography,
                { variant: 'pi', textColor: 'neutral600' },
                'No preview available'
              )
        )
      )
    )
  );
};

export default SvgPreviewInput;
