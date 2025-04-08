"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, GripVertical } from "lucide-react";
import { motion, useDragControls } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DraggableDialogProps {
  title: string;
  onClose: () => void;
  initialPosition?: { x: number; y: number };
  children: React.ReactNode;
}

export const DraggableDialog = ({
  title,
  onClose,
  initialPosition = { x: 20, y: 20 },
  children,
}: DraggableDialogProps) => {
  const [position, setPosition] = useState(initialPosition);
  const controls = useDragControls();
  const constraintsRef = useRef(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dialogRef.current &&
        !dialogRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <motion.div
      ref={dialogRef}
      drag
      dragListener={false}
      dragControls={controls}
      dragMomentum={false}
      initial={{ opacity: 0, x: initialPosition.x, y: initialPosition.y }}
      animate={{ opacity: 1, x: position.x, y: position.y }}
      exit={{ opacity: 0 }}
      className="absolute top-0 left-0 w-[320px] z-40"
      style={{ x: position.x, y: position.y }}
      onDragEnd={(event, info) => {
        setPosition({
          x: position.x + info.offset.x,
          y: position.y + info.offset.y,
        });
      }}
    >
      <Card className="flex flex-col max-h-[80vh] shadow-lg">
        <CardHeader
          className="flex flex-row justify-between items-center p-3 border-b cursor-grab active:cursor-grabbing shrink-0"
          onPointerDown={(e) => controls.start(e)}
        >
          <div className="flex items-center gap-2">
            <GripVertical className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="font-medium text-sm">{title}</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 rounded-full"
            onClick={onClose}
          >
            <X className="h-3.5 w-3.5" />
            <span className="sr-only">Close dialog</span>
          </Button>
        </CardHeader>
        <CardContent className="p-4 overflow-y-auto custom-scrollbar flex-grow">
          {children}
        </CardContent>
      </Card>
    </motion.div>
  );
};
