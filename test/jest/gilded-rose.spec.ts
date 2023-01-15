import { Item, GildedRose } from '@/gilded-rose';
import { EItem } from '@/constants';
import { items as defaultItems } from '../golden-master-text-test'; 
/**
 * DEMO TEST
 */
describe('Gilded Rose', () => {
  it('should foo', () => {
    const gildedRose = new GildedRose([new Item('foo', 0, 0)]);
    const items = gildedRose.updateQuality();
    expect(items[0].name).toBe('foo');
  });
});

/**
 * SETUP TESTS
 */
let numberOfDays: number;
let items: Item[];

beforeEach(() => {
  numberOfDays = 50; // variable: long enough number of days for solid tests, short enough to run fast
  items = [...defaultItems];
})

/**
 * RUN TESTS
 */
describe('Once the sell by date has passed, Quality degrades twice as fast', () => {
  it('should be true for generic items (i.e. not Sulfuras, nor Aged Brie, nor Tickets', () => {
    const itemList = new GildedRose(items)
    let itemListYesterday: GildedRose;
    let itemsYesterday: Item[];
    for (let i = 0; i < numberOfDays; i++) {
      itemListYesterday = JSON.parse(JSON.stringify(itemList)); // Deep Copy https://stackoverflow.com/questions/597588/how-do-you-clone-an-array-of-objects-in-javascript
      itemsYesterday = itemListYesterday.items
      itemList.updateQuality();
      items.forEach((item) => {
        if ((item.name !== EItem.SULFURAS) && (item.name !== EItem.AGED_BRIE) && (item.name !== EItem.BACKSTAGE_PASS)) {
          const itemYesterday = itemsYesterday.find((itemYesterday) => itemYesterday.name === item.name)
          if (item.sellIn >=0) {
            if (itemYesterday?.quality === 0) {
              expect((itemYesterday?.quality || 0) - item.quality).toEqual(0);
            } else {
              expect((itemYesterday?.quality || 0) - item.quality).toEqual(1);
            }
          }
          if (item.sellIn < 0) {
            if (itemYesterday?.quality === 0) {
              expect((itemYesterday?.quality || 0) - item.quality).toEqual(0);
            } else {
              expect((itemYesterday?.quality || 0) - item.quality).toEqual(2);
            }
          };
        };
      });
    };
  });
});

describe('The Quality of an item is never negative', () => {
  // TODO is this a valid requirement that if item init with negative quality throw error? Need to check with "PM"

  it('should be true always', () => {
    const itemList = new GildedRose(items)
    for (let i = 0; i < numberOfDays; i++) {
      itemList.updateQuality();
      items.forEach((item) => {
        expect(item.quality).toBeGreaterThanOrEqual(0);
      });
    };
  });
});

describe('"Aged Brie" actually increases in Quality the older it gets', () => {
  it('+1 before sell by date is overdue, +2 after', () => {
    const itemList = new GildedRose(items)
    let itemListYesterday: GildedRose;
    let itemsYesterday: Item[];
    for (let i = 0; i < numberOfDays; i++) {
      itemListYesterday = JSON.parse(JSON.stringify(itemList)); // Deep Copy https://stackoverflow.com/questions/597588/how-do-you-clone-an-array-of-objects-in-javascript
      itemsYesterday = itemListYesterday.items
      itemList.updateQuality();
      const agedBrie = items.find((item) => item.name === EItem.AGED_BRIE);
      const agedBrieYesterday = itemsYesterday.find((item) => item.name === EItem.AGED_BRIE);
      console.log('agedBrie', agedBrie, 'agedBrieYesterday', agedBrieYesterday);
        if (agedBrieYesterday?.quality !== 50) { // if it is already 50, it will not increase further
          if ((agedBrieYesterday?.sellIn || 0) < 0) {
            expect((agedBrie?.quality || 0) - (agedBrieYesterday?.quality || 0)).toEqual(2);
          };
          if ((agedBrieYesterday?.sellIn || 0) >= 0) {
            expect((agedBrie?.quality || 0) - (agedBrieYesterday?.quality || 0)).toEqual(1);
          };
        };
    };
  });
});

describe('The Quality of an item is never more than 50 (except Sulfuras)', ()=> {
  // TODO is this a valid requirement? Need to check with "PM"
  // it('GildedRose should reject items that have initial quality > 50', () => {
  //   const tooGoodItem = new Item("Item that has >50 default value", 15, 51);
  //   const itemList = new GildedRose([tooGoodItem])
  // });

  it('Aged Brie quality should never increase beyond 50', () => {
    const agedBrie = new Item(`${EItem.AGED_BRIE}`, 2, 0);
    const itemList = new GildedRose([agedBrie])

    for (let i = 0; i < numberOfDays; i++) {
      itemList.updateQuality();
      expect(agedBrie.quality).toBeLessThanOrEqual(50);
    }
  });

  it('Backstage passes should never increase beyond 50', () => {
    const backstagePasses = new Item(`${EItem.BACKSTAGE_PASS}`, 50, 45);
    const itemList = new GildedRose([backstagePasses])

    for (let i = 0; i < numberOfDays; i++) {
      itemList.updateQuality();
      expect(backstagePasses.quality).toBeLessThanOrEqual(50);
    }
  });
})

describe('"Sulfuras", being a legendary item', ()=> {
  it('never has to be sold or decreases in Quality', () => {
    const sulfuras = new Item(`${EItem.SULFURAS}`, 0, 80);
    const itemList = new GildedRose([sulfuras]);
    itemList.updateQuality();
    expect(sulfuras.quality).toEqual(80);
    itemList.updateQuality();
    expect(sulfuras.quality).toEqual(80);
  });
})

describe('"Backstage passes", like aged brie, increases in Quality as its SellIn value approaches;', () => {
  it('Quality increases by 2 when there are 10 days or less and by 3 when there are 5 days or less but Quality drops to 0 after the concert', () => {
    const backstagePass = new Item(`${EItem.BACKSTAGE_PASS}`, 15, 10);
    const itemList = new GildedRose([backstagePass]);
    for (let i = 0; i < numberOfDays; i++) {
      const backstagePassYesterday = {...backstagePass}; // spread operator required to copy, else will assign pointer to same address
      itemList.updateQuality();
      if (backstagePass.sellIn < 0){
        expect(backstagePass.quality).toEqual(0);
        return;
      }
      if (backstagePass.sellIn < 5) {
        expect(backstagePass.quality - backstagePassYesterday.quality).toEqual(3);
        return;
      }
      if (backstagePass.sellIn < 10) {
        expect(backstagePass.quality - backstagePassYesterday.quality).toEqual(2);
        return;
      }
      expect(backstagePass.quality - backstagePassYesterday.quality).toEqual(1);
    };
  });
});