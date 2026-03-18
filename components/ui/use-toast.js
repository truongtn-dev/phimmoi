import React from 'react';

export function useToast(){
  return { toast: (msg)=>console.log('toast',msg) };
}

export default useToast;
