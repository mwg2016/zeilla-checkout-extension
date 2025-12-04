import '@shopify/ui-extensions/preact';
import {render} from "preact";
import { useState } from 'preact/hooks';

// 1. Export the extension
export default async () => {
  render(<Extension />, document.body)
};

function Extension() {
  if (!shopify.instructions.value.attributes.canUpdateAttributes) {
    return (
      <s-banner heading="checkout-cart-line" tone="warning">
        {shopify.i18n.translate("attributeChangesAreNotSupported")}
      </s-banner>
    );
  }
  

  const [loading, setLoading] = useState(false);

    const handleRemove = async (item) => {
      setLoading(true);
      try {

        if (!item) return;

        await shopify.applyCartLinesChange({
          type: "removeCartLine",
          id: item.id,
          quantity: item.quantity,
        });

      } catch (error) {
        console.error('Error removing cart line:', error);
      }
      finally{
        setLoading(false);
      }
    }
    

  // 3. Render a UI
  return (
    <>
      {shopify.target.value.attributes.find(attr => attr.key === '_additional_prd')
        ? <s-link  onClick={ () => handleRemove(shopify.target.value)}>
            {loading ? (<s-spinner></s-spinner>) : (<s-text type="small" color="base" tone='custom'>Remove</s-text>)}
          </s-link>
        : null
      }
    </>
  );



}