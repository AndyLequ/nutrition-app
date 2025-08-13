// testFatSecret.ts
import { foodApi } from '../services/api';

(async () => {
  try {
    const foods = await foodApi.getFatSecretFoods({ query: 'chicken', limit: 2 });
    console.log('FatSecret foods:', foods);
  } catch (err) {
    console.error(err);
  }
})();
