// To support Safari/iPad
// https://github.com/mozilla/pdf.js/wiki/Frequently-Asked-Questions#which-browsersenvironments-are-supported
import { GlobalWorkerOptions } from 'pdfjs-dist/legacy/build/pdf.mjs'
import pdfjsWorker from 'pdfjs-dist/legacy/build/pdf.worker?url'

GlobalWorkerOptions.workerSrc = pdfjsWorker
