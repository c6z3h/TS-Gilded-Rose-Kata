import { Item, GildedRose } from "@/gilded-rose";

const daysRepeator = (gildedRose: { updateQuality }, days: number) => {
  let items;
  for (let i = days; i > 0; i--) {
    items = gildedRose.updateQuality();
  }
  return items;
};

describe("Gilded Rose", () => {
  it("should foo", () => {
    const gildedRose = new GildedRose([new Item("foo", 0, 0)]);
    const items = gildedRose.updateQuality();
    expect(items[0].name).toBe("foo");
  });

  it("Once the sell by date has passed, Quality degrades twice as fast", () => {
    const ITEM_TO_SELL = "Hammer";
    const QUALITY = 20;
    const SELL_IN_DAY = 1;
    const DAYS_TO_RUN = 3;
    const gildedRose = new GildedRose([
      new Item(ITEM_TO_SELL, SELL_IN_DAY, QUALITY),
    ]);
    const items = daysRepeator(gildedRose, DAYS_TO_RUN);
    expect(items[0].quality).toBe(15);
  });

  it("The Quality of an item is never negative", () => {
    const ITEM_TO_SELL = "Elixir of the Mongoose";
    const QUALITY = 2;
    const SELL_IN_DAY = 1;
    const DAYS_TO_RUN = 10;
    const gildedRose = new GildedRose([
      new Item(ITEM_TO_SELL, SELL_IN_DAY, QUALITY),
    ]);
    const items = daysRepeator(gildedRose, DAYS_TO_RUN);
    expect(items[0].quality).toBe(0);
  });

  it('"Aged Brie" actually increases in Quality the older it gets', () => {
    const ITEM_TO_SELL = "Aged Brie";
    const QUALITY = 30;
    const SELL_IN_DAY = 10;
    const DAYS_TO_RUN = 10;
    const gildedRose = new GildedRose([
      new Item(ITEM_TO_SELL, SELL_IN_DAY, QUALITY),
    ]);
    const items = daysRepeator(gildedRose, DAYS_TO_RUN);
    expect(items[0].quality).toBe(40);
  });

  it(' "Sulfuras", being a legendary item, never has to be sold or decreases in Quality', () => {
    const ITEM_TO_SELL = "Sulfuras, Hand of Ragnaros";
    const QUALITY = 80;
    const SELL_IN_DAY = 10;
    const DAYS_TO_RUN = 50;
    const gildedRose = new GildedRose([
      new Item(ITEM_TO_SELL, SELL_IN_DAY, QUALITY),
    ]);
    const items = daysRepeator(gildedRose, DAYS_TO_RUN);
    expect(items[0].quality).toBe(QUALITY);
  });

  it(' "Backstage passes", like aged brie, increases in Quality as its SellIn value approaches;', () => {
    const ITEM_TO_SELL = "Backstage passes to a TAFKAL80ETC concert";
    const QUALITY = 30;
    const SELL_IN_DAY = 10;
    const DAY_WITH_2_INCREASE = 5;
    const DAY_WITH_3_INCREASE = 3;
    const DAYS_TO_RUN = DAY_WITH_2_INCREASE + DAY_WITH_3_INCREASE;
    const EXPECTED_RESULT =
      QUALITY + 2 * DAY_WITH_2_INCREASE + 3 * DAY_WITH_3_INCREASE;
    const gildedRose = new GildedRose([
      new Item(ITEM_TO_SELL, SELL_IN_DAY, QUALITY),
    ]);
    const items = daysRepeator(gildedRose, DAYS_TO_RUN);
    expect(items[0].quality).toBe(EXPECTED_RESULT);
  });

  it('"Conjured" items degrade in Quality twice as fast as normal items', () => {
    const ITEM_TO_SELL = "Conjured Mana Cake";
    const QUALITY = 30;
    const SELL_IN_DAY = 10;
    const DAYS_TO_RUN = 15;
    const EXPECTED_RESULT = 0;
    const gildedRose = new GildedRose([
      new Item(ITEM_TO_SELL, SELL_IN_DAY, QUALITY),
    ]);
    const items = daysRepeator(gildedRose, DAYS_TO_RUN);
    expect(items[0].quality).toBe(EXPECTED_RESULT);
  });
});
