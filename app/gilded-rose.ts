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

const specialItems = [
  "Aged Brie",
  "Backstage passes to a TAFKAL80ETC concert",
  "Sulfuras, Hand of Ragnaros",
];

export class GildedRose {
  items: Array<Item>;

  constructor(items = [] as Array<Item>) {
    this.items = items;
    this.handleAgedBrie = this.handleAgedBrie.bind(this);
    this.handleConcertPasses = this.handleConcertPasses.bind(this);
    this.handleSulfuras = this.handleSulfuras.bind(this);
    this.handleExpiredItems = this.handleExpiredItems.bind(this);
    this.handleFreshItems = this.handleFreshItems.bind(this);
  }

  handleConcertPasses(item: { name: string; sellIn: number; quality: number }) {
    const { name, sellIn, quality } = item;
    let qualityTrack: number = quality;
    if (name === "Backstage passes to a TAFKAL80ETC concert" && quality < 50) {
      if (sellIn < 11) qualityTrack += 1;
      if (sellIn < 6) qualityTrack += 1;
    }
    return qualityTrack;
  }

  handleSulfuras(item: { name: string; sellIn: number }) {
    const { name, sellIn } = item;
    let sellInTrack: number = sellIn;
    if (name != "Sulfuras, Hand of Ragnaros") {
      sellInTrack -= 1;
    }
    return sellInTrack;
  }

  handleAgedBrie(item: { name: string; sellIn: number; quality: number }) {
    const { name, sellIn, quality } = item;
    let qualityTrack: number = quality;
    if (name === "Aged Brie" && quality < 50 && sellIn < 0) {
      qualityTrack += 1;
    }
    return qualityTrack;
  }

  handleExpiredItems(item: { name: string; sellIn: number; quality: number }) {
    const { name, sellIn, quality } = item;
    let qualityTrack: number = quality;
    if (sellIn < 0) {
      if (!specialItems.includes(name) && quality > 0) {
        qualityTrack -= 1;
      } else {
        qualityTrack -= qualityTrack;
      }
    }
    return qualityTrack;
  }

  handleFreshItems(item: { name: string; quality: number }) {
    const { name, quality } = item;
    let qualityTrack: number = quality;
    if (!specialItems.includes(name) && quality > 0) {
      qualityTrack -= 1;
    } else {
      if (quality < 50) {
        qualityTrack += 1;
      }
    }
    return qualityTrack;
  }

  updateQuality() {
    const items = this.items;

    for (let i = 0; i < items.length; i++) {
      items[i].quality = this.handleFreshItems(items[i]);
      items[i].quality = this.handleConcertPasses(items[i]);
      items[i].sellIn = this.handleSulfuras(items[i]);
      items[i].quality = this.handleExpiredItems(items[i]);
      items[i].quality = this.handleAgedBrie(items[i]);
    }
    items.forEach((item) => {
      item.quality = this.handleFreshItems(item);
      item.quality = this.handleConcertPasses(item);
      item.sellIn = this.handleSulfuras(item);
      item.quality = this.handleExpiredItems(item);
      item.quality = this.handleAgedBrie(item);
      item.quality = this.handleConjuredItems(item);
    });

    return items;
  }
}
