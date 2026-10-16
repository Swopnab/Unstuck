import { useEffect, useRef, useId, type ReactNode } from 'react';
import { X } from 'lucide-react';
export function Dialog({title,onClose,children}:{title:string;onClose:()=>void;children:ReactNode}) {
 const ref=useRef<HTMLDialogElement>(null);const titleId=useId();
 useEffect(()=>{const d=ref.current;if(d&&!d.open)d.showModal();},[]);
 return <dialog ref={ref} aria-labelledby={titleId} onCancel={onClose} onClose={onClose} className="modal"><header className="modal-head"><h2 id={titleId}>{title}</h2><button type="button" className="icon-button" aria-label="Close dialog" onClick={()=>ref.current?.close()}><X size={20}/></button></header>{children}</dialog>;
}
