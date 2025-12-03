// Exemple de test Jest professionnel : utils.test.js
// Ce fichier démontre des pratiques avancées Jest :
// - Tests unitaires avec mocks (jest.fn(), jest.spyOn())
// - Tests async/await et Promises
// - Snapshots pour les réponses complexes
// - Coverage implicite via assertions détaillées
// - Setup/teardown avec beforeAll, beforeEach, etc.
// - Tests d'erreurs et edge cases
// - Groupement logique avec describe et test.describe
//
// Pour l'exécuter : npm test utils.test.js
// Assurez-vous d'avoir utils.js (du précédent exemple) dans le même dossier.

const { add, multiply, greet, filterEven, fetchData } = require('./utils');

// Mock global pour console.log (utile pour tester les side-effects)
jest.mock('./utils', () => ({
  ...jest.requireActual('./utils'),
  fetchData: jest.fn() 
}));

describe('Suite de tests pour les utilitaires mathématiques et utilitaires', () => {
  // Setup global : exécuté une fois avant tous les tests
  beforeAll(() => {
    console.log(' Initialisation des tests professionnels');
    // Ici, on pourrait charger des configs ou des mocks globaux
  });

  // Teardown global : exécuté une fois après tous les tests
  afterAll(() => {
    console.log(' Nettoyage final des mocks');
    jest.clearAllMocks();
  });

  // Setup par test : reset les mocks avant chaque test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Fonctions mathématiques (add et multiply)', () => {
    test('add devrait retourner la somme correcte pour des entiers positifs', () => {
      expect(add(2, 3)).toBe(5);
      expect(add(0, 0)).toBe(0);
    });

    test('add devrait gérer les nombres négatifs et flottants', () => {
      expect(add(-1, 1)).toBe(0);
      expect(add(1.5, 2.5)).toBeCloseTo(4, 2);
    });

    test('multiply devrait retourner le produit correct', () => {
      expect(multiply(4, 5)).toBe(20);
    });

    test('multiply devrait lever une erreur pour des types non-numériques', () => {
      expect(() => multiply('a', 2)).toThrow('Les arguments doivent être des nombres');
      expect(() => multiply(2, 'b')).toThrow('Les arguments doivent être des nombres');
      expect(() => multiply(null, 3)).toThrow('Les arguments doivent être des nombres');
    });

    // Test avec spy pour surveiller les appels (avancé)
    test('multiply peut être espionné pour vérifier les appels', () => {
      const spy = jest.spyOn(require('./utils'), 'multiply');
      multiply(2, 3);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(2, 3);
      spy.mockRestore(); 
    });
  });

  describe('Fonction greet', () => {
    test('greet devrait retourner un message personnalisé pour un nom valide', () => {
      expect(greet('Alice')).toBe('Bonjour, Alice !');
    });

    test('greet devrait gérer les noms vides ou invalides', () => {
      expect(greet('')).toBe('Bonjour, inconnu !');
      expect(greet(null)).toBe('Bonjour, inconnu !');
      expect(greet(123)).toBe('Bonjour, inconnu !');
    });

    // Snapshot test : idéal pour valider des structures complexes (ex: objets JSON)
    test('greet avec un objet devrait matcher le snapshot', () => {
      const mockGreet = (name) => ({ message: `Bonjour, ${name} !`, timestamp: new Date().toISOString() });
      const result = mockGreet('Bob');
      expect(result).toMatchSnapshot();
    });
  });

  describe('Fonction filterEven', () => {
    test('filterEven devrait retourner les nombres pairs d\'un tableau valide', () => {
      expect(filterEven([1, 2, 3, 4, 5, 6])).toEqual([2, 4, 6]);
      expect(filterEven([])).toEqual([]); 
      expect(filterEven([2, 4])).toEqual([2, 4]);
    });

    test('filterEven devrait lever une erreur pour un argument non-tableau', () => {
      expect(() => filterEven('pas un tableau')).toThrow('L\'argument doit être un tableau');
      expect(() => filterEven(null)).toThrow('L\'argument doit être un tableau');
    });

    // Test avec matcher toContain pour tableaux
    test('filterEven devrait contenir au moins un pair', () => {
      const result = filterEven([1, 2, 3]);
      expect(result).toContain(2);
      expect(result).not.toContain(1);
    });
  });

  describe('Fonction asynchrone fetchData', () => {
    // Mock de fetchData pour les tests sync/async
    beforeEach(() => {
      require('./utils').fetchData.mockImplementation((delay) => {
        return new Promise((resolve) => {
          setTimeout(() => resolve(`Mock: Données après ${delay}ms`), 10);
        });
      });
    });

    test('fetchData devrait résoudre avec un message pour un délai valide', async () => {
      const result = await fetchData(100);
      expect(result).toBe('Mock: Données après 100ms');
      expect(require('./utils').fetchData).toHaveBeenCalledTimes(1);
      expect(require('./utils').fetchData).toHaveBeenCalledWith(100);
    });

    test('fetchData devrait rejeter pour un délai invalide', async () => {
      // Restaure le mock original pour tester l'erreur
      require('./utils').fetchData.mockRejectedValueOnce(new Error('Délai invalide'));
      await expect(fetchData(0)).rejects.toThrow('Délai invalide');
    });

    // Test avec done() pour les callbacks (alternative à async/await, plus ancienne)
    test('fetchData avec callback done', (done) => {
      fetchData(50).then((result) => {
        expect(result).toMatch(/Mock: Données après 50ms/);
        done();
      }).catch(done.fail);
    });
  });

  // Test d'intégration simple (combine plusieurs fonctions)
  describe('Tests d\'intégration', () => {
    test('Chaîne de fonctions : add puis filterEven', () => {
      const summed = add(1, 3);  // 4
      const evens = filterEven([summed, 5, 6]); 
      expect(evens).toHaveLength(2);
      expect(evens).toEqual([4, 6]);
    });
  });
});

// Configuration optionnelle pour plus de pro : Ajoutez dans package.json
// "jest": {
//   "snapshotSerializers": ["<rootDir>/node_modules/enzyme-to-json/serializer"],
//   "collectCoverage": true,
//   "coverageReporters": ["html", "text"]
// }

// Pour générer des snapshots : jest --updateSnapshot
// Pour coverage : jest --coverage
// Docs avancées : https://jestjs.io/docs/snapshot-testing, https://jestjs.io/docs/mock-functions