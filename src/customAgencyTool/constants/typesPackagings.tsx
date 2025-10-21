import type { InterfaceItem } from '../components/ui/mySelect';

export const TypesPackagings: Array<InterfaceItem> = [
    { value: 'LCL', label: 'Less than container load' },
    { value: 'FCL', label: 'Full container load shipping' }
];

interface IPackagings {
    'Clase Tica': string;
    'Descripcion TICA': string;
    'Código EDIFACT': string;
    'Descripcion EDIFACT': string;
}

const TicaPackagings: Array<IPackagings> = [
    // {
    //   "Clase Tica": "BOX",
    //   "Descripcion TICA": "CAJA/BOX",
    //   "Código EDIFACT": "BX",
    //   "Descipcion EDIFACT": "CAJA",
    // },
    // {
    //   "Clase Tica": "BRC",
    //   "Descripcion TICA": "AMARRA/BRACING",
    //   "Código EDIFACT": "PA",
    //   "Descipcion EDIFACT": "PAQUETE, BULTO, LOTE O PALETA",
    // },
    // {
    //   "Clase Tica": "PIC",
    //   "Descripcion TICA": "PICHINGAS",
    //   "Código EDIFACT": "BA",
    //   "Descipcion EDIFACT": "BARRILES",
    // },
    // {
    //   "Clase Tica": "PAQ",
    //   "Descripcion TICA": "PAQUETES",
    //   "Código EDIFACT": "PK",
    //   "Descipcion EDIFACT": "PAQUETE",
    // },
    // {
    //   "Clase Tica": "CTN",
    //   "Descripcion TICA": "CAJA DE CARTON/CARTON",
    //   "Código EDIFACT": "DC",
    //   "Descipcion EDIFACT": "CAJA DE CARTON MULTICAPA",
    // },

    {
        'Clase Tica': 'BOX',
        'Descripcion TICA': 'CAJA/BOX',
        'Código EDIFACT': 'BX',
        'Descripcion EDIFACT': 'CAJA'
    },
    {
        'Clase Tica': 'BRC',
        'Descripcion TICA': 'AMARRA/BRACING',
        'Código EDIFACT': 'PA',
        'Descripcion EDIFACT': 'PAQUETE, BULTO, LOTE O PALETA'
    },
    {
        'Clase Tica': 'PIC',
        'Descripcion TICA': 'PICHINGAS',
        'Código EDIFACT': 'BA',
        'Descripcion EDIFACT': 'BARRILES'
    },
    {
        'Clase Tica': 'PAQ',
        'Descripcion TICA': 'PAQUETES',
        'Código EDIFACT': 'PK',
        'Descripcion EDIFACT': 'PAQUETE'
    },
    {
        'Clase Tica': 'CTN',
        'Descripcion TICA': 'CAJA DE CARTON/CARTON',
        'Código EDIFACT': 'DC',
        'Descripcion EDIFACT': 'CAJA DE CARTON MULTICAPA'
    },
    {
        'Clase Tica': 'DRM',
        'Descripcion TICA': 'TAMBORES',
        'Código EDIFACT': 'DR',
        'Descripcion EDIFACT': 'TAMBOR'
    },
    {
        'Clase Tica': 'BAG',
        'Descripcion TICA': 'SACOS',
        'Código EDIFACT': 'BG',
        'Descripcion EDIFACT': 'BOLSA O SACO'
    },
    {
        'Clase Tica': 'CAN',
        'Descripcion TICA': 'LATAS',
        'Código EDIFACT': 'CA',
        'Descripcion EDIFACT': 'LATA'
    },
    {
        'Clase Tica': 'PAL',
        'Descripcion TICA': 'PALETAS',
        'Código EDIFACT': 'PL',
        'Descripcion EDIFACT': 'PALETA'
    },
    {
        'Clase Tica': 'TUB',
        'Descripcion TICA': 'TUBOS',
        'Código EDIFACT': 'TU',
        'Descripcion EDIFACT': 'TUBO'
    },
    {
        'Clase Tica': 'CRY',
        'Descripcion TICA': 'CILINDROS',
        'Código EDIFACT': 'CY',
        'Descripcion EDIFACT': 'CILINDRO'
    },
    {
        'Clase Tica': 'JAR',
        'Descripcion TICA': 'FRASCOS',
        'Código EDIFACT': 'JR',
        'Descripcion EDIFACT': 'FRASCO'
    },
    {
        'Clase Tica': 'REEL',
        'Descripcion TICA': 'BOBINAS',
        'Código EDIFACT': 'RL',
        'Descripcion EDIFACT': 'BOBINA'
    },
    {
        'Clase Tica': 'CRD',
        'Descripcion TICA': 'ENROLLADO/CARRETE',
        'Código EDIFACT': 'CO',
        'Descripcion EDIFACT': 'CARRETE'
    },
    {
        'Clase Tica': 'BAR',
        'Descripcion TICA': 'BARRAS',
        'Código EDIFACT': 'BR',
        'Descripcion EDIFACT': 'BARRA'
    },
    {
        'Clase Tica': 'CSK',
        'Descripcion TICA': 'CUBIERTA DE PIEL',
        'Código EDIFACT': 'SK',
        'Descripcion EDIFACT': 'PIEL O CUBIERTA'
    },
    {
        'Clase Tica': 'CRF',
        'Descripcion TICA': 'RECIPIENTE REFRIGERADO',
        'Código EDIFACT': 'RF',
        'Descripcion EDIFACT': 'RECIPIENTE REFRIGERADO'
    },
    {
        'Clase Tica': 'BLK',
        'Descripcion TICA': 'GRANEL',
        'Código EDIFACT': 'VL',
        'Descripcion EDIFACT': 'CARGA A GRANEL'
    },
    {
        'Clase Tica': 'NET',
        'Descripcion TICA': 'RED/NET',
        'Código EDIFACT': 'NE',
        'Descripcion EDIFACT': 'RED'
    },
    {
        'Clase Tica': 'CHS',
        'Descripcion TICA': 'ESTUCHES',
        'Código EDIFACT': 'CS',
        'Descripcion EDIFACT': 'ESTUCHE'
    },
    {
        'Clase Tica': 'TAN',
        'Descripcion TICA': 'TANQUES',
        'Código EDIFACT': 'TK',
        'Descripcion EDIFACT': 'TANQUE'
    },
    {
        'Clase Tica': 'WRP',
        'Descripcion TICA': 'ENVUELTOS',
        'Código EDIFACT': 'WR',
        'Descripcion EDIFACT': 'ENVUELTO'
    }
];

export const TicaPackagins: Array<InterfaceItem> = TicaPackagings.map(
    (item) => {
        return {
            value: item['Código EDIFACT'],
            label: item['Descripcion TICA'],
            description: item['Descripcion EDIFACT']
        };
    }
);
