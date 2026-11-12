import { openBrowserAsync } from 'expo-web-browser';

import { UrlLey1581 } from '@/constants/politica';

/** Abre el texto oficial de la Ley 1581 de 2012 en el navegador integrado de la app. */
export function abrirLey1581() {
  void openBrowserAsync(UrlLey1581);
}
