import '@shopify/ui-extensions/preact';
import {render} from "preact";

// 1. Export the extension
export default async () => {
  render(<Extension />, document.body)
};

function Extension() {
  // 2. Check instructions for feature availability, see https://shopify.dev/docs/api/checkout-ui-extensions/apis/cart-instructions for details
  if (!shopify.instructions.value.attributes.canUpdateAttributes) {
    // For checkouts such as draft order invoices, cart attributes may not be allowed
    // Consider rendering a fallback UI or nothing at all, if the feature is unavailable
    return (
      <s-banner heading="checkout-reviews" tone="warning">
        {shopify.i18n.translate("attributeChangesAreNotSupported")}
      </s-banner>
    );
  }

  const mainImage = shopify.settings.value.Main_img;
  const mainTitle = shopify.settings.value.Main_title
  const starimage = shopify.settings.value.star_img || "https://cdn.shopify.com/s/files/1/0508/7943/0843/files/2ZEXxvj.png?v=1764825582&width=100";
  const bottomText = shopify.settings.value.bottom_text


  const reviews = [];

  for (let i = 1; i <= 5; i++) {
    const element = `review_title_${i}`;
    const heading = shopify.settings.value[element];
    const paragraphElement = `review_paragraph_${i}`;
    const paragraph = shopify.settings.value[paragraphElement];
    const textElement = `review_bottom_text_${i}`;
    const text = shopify.settings.value[textElement];

    if (heading || paragraph || text) {
      reviews.push(
        {heading, paragraph, text}
      )
    }
  }
  

  // 3. Render a UI
  return (
    <>
      {mainImage &&
        <s-grid justifyContent='center' justifyItems='center'>
          <s-grid-item inlineSize='300px'>
            <s-image inlineSize="auto" src={`${mainImage}`} alt="Trust pilot review"></s-image>
          </s-grid-item>
        </s-grid>
      }

      {mainTitle &&
        <s-grid justifyContent='center' justifyItems='center' paddingBlock='base'>
          <s-grid-item >
            <s-heading >{mainTitle}</s-heading>
          </s-grid-item>
        </s-grid>
      }

      <s-scroll-box>
        <s-grid gridTemplateColumns="200px 200px 200px 200px 200px" gap="base" paddingBlock="base">
          
          {reviews.map((review) => (
            <s-grid-item >
              <s-grid gap="small-100" padding="base" border="base" borderStyle="solid" borderRadius="base" blockSize="100%" gridTemplateRows='20px auto 1fr auto'>
                <s-image inlineSize="auto" src={`${starimage}`} alt="Trust pilot review"></s-image>

                <s-heading>{review.heading}</s-heading>

                <s-paragraph >{review.paragraph}</s-paragraph>

                <s-text type="small" color="subdued">{review.text}</s-text>

              </s-grid>
            </s-grid-item>
          ))}

        </s-grid>
      </s-scroll-box>

      { bottomText &&
        <s-grid justifyContent='center' justifyItems='center' paddingBlock='base'>
          <s-grid-item >
            <s-paragraph >{bottomText}</s-paragraph>
          </s-grid-item>
        </s-grid>
      }
    </>
  );
}





  // const reveiws = [
  //   {
  //     heading: "'Always In My Heart' Keepsake Knot Bracelet",
  //     paragraph: "Bought as a gift for grandson. Looks very well made. Just cannot figure out how to open it to get it on.",
  //     text: "PEGGY PURVIS, 6 hours ago"
  //   },
  //   {
  //     heading: "Finally found shapewear that doesn't roll up!",
  //     paragraph: "My son loves it. I have one question, please. Can you tell me how to open it? Can someone please follow up on this question?Thank you it's beautiful",
  //     text: "Felix Perez, 2 days ago"
  //   },
  //   {
  //     heading: "The Guardian - Son's Tiger Eye Protection Bracelet",
  //     paragraph: "My son had a very rough, and scary, last few months and his birthday is tomorrow. I saw this and couldn't believe how perfect this would be. It arrived yesterday and he loves it so much.",
  //     text: "NINA THOMAS, 5 days ago"
  //   },
  //   {
  //     heading: "'Forever Connected' Son's Customized Bracelet Gift Set",
  //     paragraph: "This was the first time Ive ever seen him so happy with a gift I have given him. It looks good and fits perfectly!",
  //     text: "Taylor N, 7 days ago"
  //   },
  //   {
  //     heading: "Finally found shapewear that doesn't roll up!",
  //     paragraph: "My son said he will cherish this for the rest of his life. He wore it right away and hasnt taken it off ever since.",
  //     text: "Lisa B., 9 days ago"
  //   },
  // ]