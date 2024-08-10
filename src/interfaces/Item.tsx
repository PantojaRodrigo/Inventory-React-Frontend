export default interface Item {
  itemId: number;
  itemName: string;
  description: string;
  location: Location;
}

export interface Location {
  locationId: number;
  state: string;
  address: string;
  phoneNumber: string;
}
