use std::collections::HashMap;

use crate::types::Currency;

pub static DEFAULT_CURRENCY: once_cell::sync::Lazy<Currency> = once_cell::sync::Lazy::new(|| {
    return Currency {
        name: "$ Dollar (USD)".to_string(),
        code: "USD".to_string(),
        api_code: "US".to_string(),
        after_price: "".to_string(),
        in_front_of_price: "$".to_string(),
    };
});

type CurrencyCode = &'static str;

pub static CURRENCIES: once_cell::sync::Lazy<HashMap<CurrencyCode, Currency>> =
    once_cell::sync::Lazy::new(|| {
        HashMap::from([
            ("USD", DEFAULT_CURRENCY.clone()),
            (
                "EUR",
                Currency {
                    name: "€ Euro (EUR)".to_string(),
                    code: "EUR".to_string(),
                    api_code: "DE".to_string(),
                    after_price: "".to_string(),
                    in_front_of_price: "€".to_string(),
                },
            ),
            (
                "CAD",
                Currency {
                    name: "$ Canadian Dollar (CAD)".to_string(),
                    code: "CAD".to_string(),
                    api_code: "CA".to_string(),
                    after_price: "".to_string(),
                    in_front_of_price: "$".to_string(),
                },
            ),
            (
                "INR",
                Currency {
                    name: "₹ Indian Rupee (INR)".to_string(),
                    code: "INR".to_string(),
                    api_code: "IN".to_string(),
                    after_price: "".to_string(),
                    in_front_of_price: "₹".to_string(),
                },
            ),
            (
                "GBP",
                Currency {
                    name: "£ British Pound (GBP)".to_string(),
                    code: "GBP".to_string(),
                    api_code: "GB".to_string(),
                    after_price: "".to_string(),
                    in_front_of_price: "£".to_string(),
                },
            ),
            (
                "UAH",
                Currency {
                    name: "₴ Ukrainian Hryvnia (UAH)".to_string(),
                    code: "UAH".to_string(),
                    api_code: "UA".to_string(),
                    after_price: "".to_string(),
                    in_front_of_price: "₴".to_string(),
                },
            ),
            (
                "RUB",
                Currency {
                    name: "₽ Russian Ruble (RUB)".to_string(),
                    code: "RUB".to_string(),
                    api_code: "RU".to_string(),
                    after_price: "".to_string(),
                    in_front_of_price: "₽".to_string(),
                },
            ),
            (
                "BYN",
                Currency {
                    name: "Br Belarusian Ruble (BYN)".to_string(),
                    code: "BYN".to_string(),
                    api_code: "BY".to_string(),
                    after_price: "".to_string(),
                    in_front_of_price: "Br".to_string(),
                },
            ),
            (
                "IDR",
                Currency {
                    name: "Rp Indonesian Rupiah (IDR)".to_string(),
                    code: "IDR".to_string(),
                    api_code: "ID".to_string(),
                    after_price: "".to_string(),
                    in_front_of_price: "Rp".to_string(),
                },
            ),
            (
                "NZD",
                Currency {
                    name: "$ New Zealand Dollar (NZD)".to_string(),
                    code: "NZD".to_string(),
                    api_code: "NZ".to_string(),
                    after_price: "".to_string(),
                    in_front_of_price: "$".to_string(),
                },
            ),
            (
                "VND",
                Currency {
                    name: "₫ Vietnamese Dong (VND)".to_string(),
                    code: "VND".to_string(),
                    api_code: "VN".to_string(),
                    after_price: "₫".to_string(),
                    in_front_of_price: "".to_string(),
                },
            ),
            (
                "BRL",
                Currency {
                    name: "R$ Brazilian Real (BRL)".to_string(),
                    code: "BRL".to_string(),
                    after_price: "".to_string(),
                    in_front_of_price: "R$".to_string(),
                    api_code: "BR".to_string(),
                },
            ),
            (
                "SGD",
                Currency {
                    name: "S$ Singapore dollar (SGD)".to_string(),
                    code: "SGD".to_string(),
                    after_price: "".to_string(),
                    in_front_of_price: "S$".to_string(),
                    api_code: "SG".to_string(),
                },
            ),
            (
                "PHP",
                Currency {
                    name: "₱ Philippine Peso (PHP)".to_string(),
                    code: "PHP".to_string(),
                    after_price: "".to_string(),
                    in_front_of_price: "₱".to_string(),
                    api_code: "PH".to_string(),
                },
            ),
            (
                "AUD",
                Currency {
                    name: "A$ Australian Dollar (AUD)".to_string(),
                    code: "AUD".to_string(),
                    after_price: "".to_string(),
                    in_front_of_price: "A$".to_string(),
                    api_code: "AU".to_string(),
                },
            ),
            (
                "MXN",
                Currency {
                    name: "$ Mexican Peso (MXN)".to_string(),
                    code: "MXN".to_string(),
                    after_price: "".to_string(),
                    in_front_of_price: "$".to_string(),
                    api_code: "MX".to_string(),
                },
            ),
            (
                "TRY",
                Currency {
                    name: "₺ Türk lirası (TRY)".to_string(),
                    code: "TRY".to_string(),
                    after_price: "".to_string(),
                    in_front_of_price: "₺".to_string(),
                    api_code: "TR".to_string(),
                },
            ),
            (
                "TWD",
                Currency {
                    name: "NT$ New Taiwan Dollar (TWD)".to_string(),
                    code: "TWD".to_string(),
                    after_price: "".to_string(),
                    in_front_of_price: "NT$".to_string(),
                    api_code: "TW".to_string(),
                },
            ),
            (
                "HUF",
                Currency {
                    name: "Ft Hungarian Forint (HUF)".to_string(),
                    code: "HUF".to_string(),
                    after_price: "".to_string(),
                    in_front_of_price: "Ft".to_string(),
                    api_code: "HU".to_string(),
                },
            ),
            (
                "PLN",
                Currency {
                    name: "zł Polish Zloty (PLN)".to_string(),
                    code: "PLN".to_string(),
                    after_price: "".to_string(),
                    in_front_of_price: "zł".to_string(),
                    api_code: "PL".to_string(),
                },
            ),
            (
                "COP",
                Currency {
                    name: "Col$ Colombian Peso (COP)".to_string(),
                    code: "COP".to_string(),
                    after_price: "".to_string(),
                    in_front_of_price: "Col$".to_string(),
                    api_code: "CO".to_string(),
                },
            ),
            (
                "MYR",
                Currency {
                    name: "RM Malaysian Ringgit (MYR)".to_string(),
                    code: "MYR".to_string(),
                    after_price: "".to_string(),
                    in_front_of_price: "RM".to_string(),
                    api_code: "MY".to_string(),
                },
            ),
            (
                "CLP",
                Currency {
                    name: "CLP$ Chilean Peso (CLP)".to_string(),
                    code: "CLP".to_string(),
                    after_price: "".to_string(),
                    in_front_of_price: "CLP$".to_string(),
                    api_code: "CL".to_string(),
                },
            ),
        ])
    });
