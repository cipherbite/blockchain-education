import * as solc from 'solc-js';

const workerCode = `
self.onmessage = function(e) {
  if (e.data.type === 'INIT') {
    self.solc = e.data.solc;
  } else if (e.data.type === 'COMPILE') {
    compileContract(e.data.code, e.data.options);
  }
};

function compileContract(code, options = {}) {
  try {
    const input = {
      language: 'Solidity',
      sources: {
        'contract.sol': {
          content: code
        }
      },
      settings: {
        outputSelection: {
          '*': {
            '*': ['*']
          }
        },
        ...options
      }
    };

    const output = JSON.parse(self.solc.compile(JSON.stringify(input)));
    
    if (output.errors) {
      const errors = output.errors.map(error => ({
        severity: error.severity,
        message: error.message,
        sourceLocation: error.sourceLocation
      }));

      self.postMessage({ 
        type: 'COMPILATION_RESULT', 
        data: { 
          success: errors.every(error => error.severity !== 'error'),
          errors,
          output 
        } 
      });
    } else {
      self.postMessage({ 
        type: 'COMPILATION_RESULT', 
        data: { 
          success: true, 
          output 
        } 
      });
    }
  } catch (error) {
    self.postMessage({ 
      type: 'COMPILATION_ERROR', 
      data: { 
        message: error.message 
      } 
    });
  }
}
`;

const blob = new Blob([workerCode], { type: 'application/javascript' });
const workerUrl = URL.createObjectURL(blob);

const createCompilerWorker = () => {
  const worker = new Worker(workerUrl);
  worker.postMessage({ type: 'INIT', solc });
  return worker;
};

export default createCompilerWorker;