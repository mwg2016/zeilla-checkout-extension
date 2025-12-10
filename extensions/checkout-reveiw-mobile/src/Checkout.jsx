import {
  reactExtension,
  Image,
  Heading,
  Text,
  useSettings,
} from "@shopify/ui-extensions-react/checkout";
import { Grid, GridItem, ScrollView, Style, View } from "@shopify/ui-extensions/checkout";

// Set up the entry point for the extension
// export default reactExtension("purchase.checkout.block.render", () => <App />);

function Checkout() {
  
  const settings = useSettings();
  
  const mainImage = settings.Main_img;
  const mainTitle = settings.Main_title || undefined;
  const starimage = settings.star_img;
  const bottomText = settings.bottom_text
  

  const reviews = [];

  for (let i = 1; i <= 5; i++) {
    const element = `review_title_${i}`;
    const heading = settings[element];
    const paragraphElement = `review_paragraph_${i}`;
    const paragraph = settings[paragraphElement];
    const textElement = `review_bottom_text_${i}`;
    const text = settings[textElement];

    if (heading || paragraph || text) {
      reviews.push(
        {heading, paragraph, text}
      )
    }
  }


  return (
    <View
      display={Style.default()
      .when({viewportInlineSize: {min: 'small'}}, )
      .when({viewportInlineSize: {min: 'medium'}}, 'none')
      .when({viewportInlineSize: {min: 'large'}}, 'none')}
    >
      {mainImage &&
        <Grid inlineAlignment="center" padding={['base', 'none']}>
          <GridItem maxInlineSize={300}>
            <Image source={mainImage} />
          </GridItem>
        </Grid>
      }

      {mainTitle &&
        <Grid inlineAlignment="center" padding={['base', 'none']}>
          <GridItem >
            <Heading >{mainTitle}</Heading>
          </GridItem>
        </Grid>
      }

      <ScrollView direction="inline">
        <Grid columns={[200, 200, 200, 200, 200, 200]} spacing="loose" paddingBlock="base">
          
          {reviews.map((review) => (
            <GridItem >
              <Grid gap="small-100" padding="base" border="base" cornerRadius="base" minBlockSize="fill" spacing="tight" rows={[20, 'auto', '1fr', 'auto']}>
                <Image source={starimage} />

                <Heading>{review.heading}</Heading>

                <Text>{review.paragraph}</Text>

                <Text type="small" appearance="subdued">{review.text}</Text>

              </Grid>
            </GridItem>
          ))}

        </Grid>
      </ScrollView>

      { bottomText &&
        <Grid inlineAlignment='center' padding={['base', 'none']}>
          <GridItem >
             <Text>{bottomText}</Text>
          </GridItem>
        </Grid>
      }
    </View>

  )

}



export default [
  reactExtension("purchase.checkout.block.render", () => <Checkout />),
  reactExtension("purchase.checkout.actions.render-before", () => <Checkout />),
];
