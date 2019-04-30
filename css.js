import parseCSS from 'css/lib/parse';

function getElementsByAttribute(doc, attr, value) {
  const matching = [];
  const elems = doc.getElementsByTagName('*');
  for (let i = 0; i < elems.length; i++) {
    if (elems[i].getAttribute(attr) === value) {
      matching.push(elems[i]);
    }
  }
  return matching;
}

function handleCSSRule(doc, rule) {
  for (let j = 0; j < rule.selectors.length; j++) {
    const selector = rule.selectors[j];
    if (selector[0] === '.') {
      // class
      for (let i = 0; i < rule.declarations.length; i++) {
        const { property, value } = rule.declarations[i];
        getElementsByAttribute(doc, 'class', selector.substring(1))
          .forEach(elem => elem.setAttribute(property, value));
      }
    }
  }
}

function handleStyleElement(doc, elem) {
  const obj = parseCSS(elem.textContent || '', { silent: true });
  if (obj.type === 'stylesheet') {
    for (let i = 0; i < obj.stylesheet.rules.length; i++) {
      handleCSSRule(doc, obj.stylesheet.rules[i]);
    }
  }
  // remove <style> tag from SVG
  elem.parentNode.removeChild(elem);
}

export default function applyCSS(doc) {
  const styles = doc.getElementsByTagName('style');
  for (let i = 0; i < styles.length; i++) {
    handleStyleElement(doc, styles.item(i));
  }
}
