use std::collections::HashMap;

use crate::types::Currency;

type CurrencyCode = &'static str;

pub static CURRENCIES: once_cell::sync::Lazy<HashMap<CurrencyCode, Currency>> =
    once_cell::sync::Lazy::new(|| {
        HashMap::from([
            (
                "USD",
                Currency {
                    name: "$ Dollar (USD)".to_string(),
                    code: "USD".to_string(),
                    api_code: "US".to_string(),
                    after_price: "".to_string(),
                    in_front_of_price: "$".to_string(),
                },
            ),
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
        ])
    });
