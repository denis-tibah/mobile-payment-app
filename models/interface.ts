export interface ICard {
  type?: string;
  cardrefrenceId?: string;
  currency?: string;
  lostYN?: string;
  frozenYN?: string;
  expiration_date?: string;
  pan?: string;
}

export interface ICardDetails {
  card?: ICard;
  cardImage?: string;
  cardNumber?: string | undefined;
}
