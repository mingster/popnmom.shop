'use server';

import { promises as fs } from 'fs';
import prismadb from '@/lib/prismadb';

// create default locales
//
export async function create_locales() {
  const locale_Path = process.cwd() + '/public/install/locales.json';

  let file = await fs.readFile(locale_Path, 'utf8');
  let data = JSON.parse(file);
  for (let i = 0; i < data.length; i++) {
    const c = data[i];
    try {
      const currency = await prismadb.currency.findUnique({
        where: { id: c.currency },
      });

      if (!currency) {
        console.error(`Currency with id ${c.currency} not found`);
        continue;
      }

      const locale = await prismadb.locale.create({
        data: {
          id: c.id,
          name: c.name,
          lng: c.lng,
          defaultCurrencyId: currency.id,
        },
      });
      console.log(locale);
    } catch (err) {
      console.error(err);
    }
  }
}

// create default payment methods and mapping to all countries
//
export async function create_paymentMethods() {
  const payment_methodPath = process.cwd() + '/public/install/payment_methods.json';

  let file = await fs.readFile(payment_methodPath, 'utf8');
  let data = JSON.parse(file);

  const countries = await prismadb.country.findMany();

  for (let i = 0; i < data.length; i++) {
    const c = data[i];
    try {
      const paymentMethod = await prismadb.paymentMethod.create({
        data: {
          name: c.name,
          payUrl: c.payurl
          /*
          paymentMethodCountryMapping: {
            createMany: {
              data: countries.map((country) => ({
                countryId: country.alpha3, // Add countryId property
              })),
            },
          },
          */
        },
      });
      console.log(paymentMethod);
    } catch (err) {
      console.error(err);
    }
  }
}

// create shipping methods and mapping to all countries
//
export async function create_shippingMethods() {
  const shipping_methodPath = process.cwd() + '/public/install/shipping_methods.json';

  const file = await fs.readFile(shipping_methodPath, 'utf8');
  const data = JSON.parse(file);

  //const countries = await prismadb.country.findMany();

  for (let i = 0; i < data.length; i++) {
    const c = data[i];
    try {
      const currency = await prismadb.currency.findUnique({
        where: { id: c.currency },
      });

      if (!currency) {
        console.error(`Currency with id ${c.currency} not found`);
        continue;
      }

      const shippingMethod = await prismadb.shippingMethod.create({
        data: {
          name: c.name,
          description: c.description,
          basic_price: c.price,
          currencyId: currency.id,
          /*
          shippingMethodCountryMapping: {
            createMany: {
              data: {
                countryId: 'TWN',
              },
            },
          },
          */
          /* create mapping for all countries
          shippingMethodCountryMapping: {
            createMany: {
              data: countries.map((country) => ({
                countryId: country.alpha3, // Add countryId property
              })),
            },
          },
          */
        },
      });

      console.log(shippingMethod);
    } catch (err) {
      console.error(err);
    }
  }
}

export async function populatePayShipLocaleData() {
  create_locales();
  create_shippingMethods();
  create_paymentMethods();
  return true;
}
