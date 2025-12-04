import "@shopify/ui-extensions/preact";
import { render } from "preact";
import { useEffect, useRef } from "preact/hooks";


export default async () => {
  render(<Extension />, document.body);
};

function Extension() {

  const checkboxref = useRef(null);
  
  
  const PRODUCT_VARIANT_ID = `${shopify.settings.value.upsell_variant}`;
  
  if (!PRODUCT_VARIANT_ID) {
    return null;
  }

  const imageUrl =
    typeof shopify.settings.value.custom_image_url === "string"
      ? shopify.settings.value.custom_image_url
      : "https://cdn.shopify.com/s/files/1/0716/2757/1483/files/ChatGPTImageDec3_2025_11_50_53AM_c577e779-6fd0-4c7b-bdcf-9e27afca9f5a.png?v=1764759129";

  const title =
    typeof shopify.settings.value.title === "string"
      ? shopify.settings.value.title
      : "Shipping insurance";

  const subtitle =
    typeof shopify.settings.value.subtitle === "string"
      ? shopify.settings.value.subtitle
      : "From Damage, Loss & Theft for $4.99";

  const description =
    typeof shopify.settings.value.description === "string"
      ? shopify.settings.value.description
      : "Get peace of mind with HeyShape's shipping insurance in the event your delivery is damaged, stolen or lost during transit we'll replace it free of charge up to $250.00";

  if (!shopify.instructions.value.lines.canAddCartLine) {
    return (
      <s-banner heading="checkout-ui-product" tone="warning">
        Cart modification is not supported in this checkout.
      </s-banner>
    );
  }

  const linesSignal = shopify.lines;

  const existingLine = linesSignal.value.find(
    (line) => line.merchandise.id === PRODUCT_VARIANT_ID
  );

  useEffect(() => {
    if (!existingLine && PRODUCT_VARIANT_ID) {
      shopify.applyCartLinesChange({
        type: "addCartLine",
        merchandiseId: PRODUCT_VARIANT_ID,
        quantity: 1,
        attributes: [{ key: "_additional_prd", value: "true" }],
      });
    }
  }, []);

  // async function handleClick() {
  //   if (!PRODUCT_VARIANT_ID) {
  //     console.error("Variant ID missing in settings");
  //     return;
  //   }

  //   if (existingLine) {
  //     const result = await shopify.applyCartLinesChange({
  //       type: "removeCartLine",
  //       id: existingLine.id,
  //       quantity: existingLine.quantity,
  //     });

  //     if (result.type === "error") {
  //       console.error("Remove error:", result.message);
  //     }
  //   } else {
  //     const result = await shopify.applyCartLinesChange({
  //       type: "addCartLine",
  //       merchandiseId: PRODUCT_VARIANT_ID,
  //       quantity: 1,
  //       attributes: [{ key: "source", value: "free-gift-toggle" }],
  //     });

  //     if (result.type === "error") {
  //       console.error("Add error:", result.message);
  //     }
  //   }
  // }

  async function handleToggle() {
    if (!PRODUCT_VARIANT_ID) return;

    const isChecked = checkboxref.current?.checked

    const currentLine = shopify.lines.value.find(
      (line) => line.merchandise.id === PRODUCT_VARIANT_ID
    );

    if (isChecked && !currentLine) {
      const result = await shopify.applyCartLinesChange({
        type: "addCartLine",
        merchandiseId: PRODUCT_VARIANT_ID,
        quantity: 1,
        attributes: [{ key: "_additional_prd", value: "true" }],
      });

      if (result.type === "error") {
        console.error("Add error:", result.message);
      }
    }

    if (!isChecked && currentLine) {
      
      const result = await shopify.applyCartLinesChange({
        type: "removeCartLine",
        id: currentLine.id,
        quantity: currentLine.quantity,
      });

      if (result.type === "error") {
        console.error("Remove error:", result.message);
      }
    }
  }

  return (
    <s-box borderRadius="base" borderWidth="base" padding="base">
      <s-grid gridTemplateColumns="56px 1fr" columnGap="base">
        <s-grid-item>
          <s-box>
            {imageUrl && <s-image sizes="small" src={imageUrl} alt="Product image" />}
          </s-box>
        </s-grid-item>

        <s-grid-item>
          <s-grid gridTemplateColumns="1fr auto">
            <s-grid-item>
              {title && <s-heading>{title}</s-heading>}
            </s-grid-item>

            <s-grid-item>
              <s-stack gap="base" alignItems="end">
                <s-checkbox
                  ref={checkboxref}
                  checked={!!shopify.lines.value.find((line) => line.merchandise.id === PRODUCT_VARIANT_ID)}
                  onChange={handleToggle}
                />
              </s-stack>
            </s-grid-item>
          </s-grid>

          <s-stack gap="none" alignItems="start">
            {subtitle && <s-text type="small" color="subdued">{subtitle}</s-text>}

            {description && <s-text type="small" color="subdued">{description}</s-text>}
          </s-stack>

        </s-grid-item>
      </s-grid>
    </s-box>
  );
}
