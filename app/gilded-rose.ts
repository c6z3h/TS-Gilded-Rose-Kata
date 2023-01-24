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
    // TODO Consider Functionl Programming -- but it seems overkill for this
    this.items.forEach((item) => {
      // 1. Sulfuras never needs update
      if (item.name !== EItem.SULFURAS) item.sellIn -= 1

      // 2. Aged Brie update
      if (item.name === EItem.AGED_BRIE) {
        if (item.quality < 50) item.quality += 1;
        if (item.quality < 50 && item.sellIn < 0) item.quality += 1;
      }

      // 3. Backstage Pass update
      if (item.name === EItem.BACKSTAGE_PASS) {
        if (item.quality < 50) item.quality += 1;
        if (item.sellIn < 10 && item.quality < 50) item.quality += 1;
        if (item.sellIn < 5 && item.quality < 50) item.quality += 1;
        if (item.sellIn < 0) item.quality = 0;
      };
      
      // 4. Conjured items update
      if (item.name === EItem.CONJURED_CAKE) {
        if (item.quality > 0) item.quality = Math.max(item.quality - 2, 0)
        if (item.quality > 0 && item.sellIn < 0) item.quality = Math.max(item.quality - 2, 0)
      }
      // 5. Other Items update
      if ((item.name !== EItem.SULFURAS) && (item.name !== EItem.AGED_BRIE ) && (item.name !== EItem.BACKSTAGE_PASS) && (item.name !== EItem.CONJURED_CAKE)) {
        if (item.quality > 0) item.quality -= 1;
        if (item.quality > 0 && item.sellIn < 0) item.quality -= 1;
      }
    })

    return this.items;
  }
}
