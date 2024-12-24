import { useCallback, useEffect, useState } from "react";

const useAtom = ($ATOM) => {
  const [value, set_value] = useState($ATOM.get());

  useEffect(() => {
    const unbindListener = $ATOM.subscribe((newValue) => {
      set_value(newValue);
    });

    return () => {
      unbindListener();
    };
  }, [$ATOM]);

  const setValue = useCallback(
    (v) => {
      $ATOM.set(v);
    },
    [$ATOM]
  );

  return [value, setValue];
};

export default useAtom;
