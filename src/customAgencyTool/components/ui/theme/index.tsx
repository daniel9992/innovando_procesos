// src/theme.ts

import { createSystem, defaultConfig } from '@chakra-ui/react';

// defaultConfig contiene la configuración base de Chakra (breakpoints, etc.)
// El segundo argumento es tu personalización.
export const theme1 = createSystem(defaultConfig, {
    theme: {
        // 1. TOKENS: Valores brutos y primitivos.
        tokens: {
            fonts: {
                // Defines los nombres de las fuentes que usarás
                heading: { value: 'Montserrat, sans-serif' }, // Buena práctica añadir un fallback
                body: { value: 'Open Sans, sans-serif' }
            }
            // Aquí podrías definir tu paleta de colores base si quisieras
            // colors: {
            //   myBlue: { value: '#007BFF' }
            // }
        },

        // 2. SEMANTIC TOKENS: Dan significado a los tokens.
        // Su valor cambia según el contexto (ej: _light, _dark).
        semanticTokens: {
            colors: {
                // --- Colores de Fondo (bg) ---
                bg: {
                    DEFAULT: {
                        // El color de fondo principal de la app
                        value: { _light: 'white', _dark: '#141414' }
                    },
                    subtle: {
                        // Un color de fondo ligeramente distinto al principal
                        value: { _light: 'gray.50', _dark: '#1a1a1a' }
                    },
                    muted: {
                        // Un color de fondo aún más apagado
                        value: { _light: 'gray.100', _dark: '#262626' }
                    }
                },

                // --- Colores de Texto/Primer Plano (fg) ---
                fg: {
                    DEFAULT: {
                        // Color de texto principal
                        value: { _light: 'gray.800', _dark: 'whiteAlpha.900' }
                    },
                    muted: {
                        // Color para texto secundario o menos importante
                        value: { _light: 'gray.600', _dark: 'whiteAlpha.700' }
                    }
                },

                // --- Colores de Borde (border) ---
                border: {
                    DEFAULT: {
                        // Color de borde por defecto para componentes como Input o Card
                        value: { _light: 'gray.200', _dark: 'whiteAlpha.300' }
                    }
                }
            }
        }
    }
});

export const theme = createSystem(defaultConfig, {
    theme: {
        tokens: {
            fonts: {
                heading: { value: 'Montserrat Variable' },
                body: { value: 'Open Sans Variable' }
            }
        },
        semanticTokens: {
            colors: {
                // bg: {
                //     DEFAULT: {
                //         value: { _light: '{colors.white}', _dark: '#141414' } // Custom dark background
                //     },
                //     subtle: {
                //         value: { _light: '{colors.gray.50}', _dark: '#1a1a1a' } // Custom dark subtle background
                //     },
                //     muted: {
                //         value: { _light: '{colors.gray.100}', _dark: '#262626' } // Custom dark muted background
                //     }
                // },
                bg: {
                    DEFAULT: {
                        // El color de fondo principal de la app
                        value: { _light: 'white', _dark: '#141414' }
                    },
                    // subtle: {
                    //     value: { _light: '{colors.gray.50}', _dark: '#48c20f' } // Custom dark subtle background
                    // },
                    muted: {
                        value: {
                            _light: '#EDF2F7',
                            _dark: '#2D3748'
                        } // Custom dark muted background
                    }
                }
                // fg: {
                //     DEFAULT: {
                //         value: { _light: '{colors.black}', _dark: '#e5e5e5' } // Custom dark text color
                //     },
                //     muted: {
                //         value: { _light: '{colors.gray.600}', _dark: '#a3a3a3' } // Custom dark muted text
                //     }
                // },
                // border: {
                //     DEFAULT: {
                //         value: { _light: '{colors.gray.200}', _dark: '#404040' } // Custom dark border
                //     }
                // }
            }
        }
    }
});
