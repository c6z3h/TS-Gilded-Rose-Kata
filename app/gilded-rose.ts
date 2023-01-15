import { EItem } from "./constants";

export class Item {
  name: string;
  sellIn: number;
  quality: number;

  constructor(name, sellIn, quality) {
    this.name = name;
    this.sellIn = sellIn;
    this.quality = quality;
  }
}

export class GildedRose {
  items: Array<Item>;

  constructor(items = [] as Array<Item>) {
    this.items = items;
  }

  updateQuality() {
    // TODO change to function programming
    this.items.forEach((item) => {
    // 1. Sulfuras never needs update
    // let sulfurases: Item[] | undefined = this.items.filter((item) => item.name === EItem.SULFURAS)

    // 2. Aged Brie update
    if (item.name === EItem.AGED_BRIE) {
      item.sellIn -= 1;
    }

    // 3. Backstage Pass update
    if (item.name === EItem.BACKSTAGE_PASS) {
      item.sellIn -= 1;
    };
    
    // 4. Other Items update
    if ((item.name !== EItem.SULFURAS) && (item.name !== EItem.AGED_BRIE ) && (item.name !== EItem.BACKSTAGE_PASS)) {
      item.sellIn -= 1;
    }

      if (item.name != 'Aged Brie' && item.name != 'Backstage passes to a TAFKAL80ETC concert') {
        if (item.quality > 0) {
          if (item.name != 'Sulfuras, Hand of Ragnaros') {
            item.quality = item.quality - 1
          }
        }
      } else {
        if (item.quality < 50) {
          item.quality = item.quality + 1
          if (item.name == 'Backstage passes to a TAFKAL80ETC concert') {
            if (item.sellIn < 11) {
              if (item.quality < 50) {
                item.quality = item.quality + 1
              }
            }
            if (item.sellIn < 6) {
              if (item.quality < 50) {
                item.quality = item.quality + 1
              }
            }
          }
        }
      }
      if (item.sellIn < 0) {
        if (item.name != 'Aged Brie') {
          if (item.name != 'Backstage passes to a TAFKAL80ETC concert') {
            if (item.quality > 0) {
              if (item.name != 'Sulfuras, Hand of Ragnaros') {
                item.quality = item.quality - 1
              }
            }
          } else {
            item.quality = item.quality - item.quality
          }
        } else {
          if (item.quality < 50) {
            item.quality = item.quality + 1
          }
        }
      }
    })

    return this.items;
  }
}
