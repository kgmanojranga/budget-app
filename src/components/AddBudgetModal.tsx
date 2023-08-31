import { useRef } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { useBudgets } from "../contexts/BudgetsContext";

export function AddBudgetModal({
  show,
  handleClose
}: {
  show: boolean;
  handleClose: () => void;
}) {
  const { addBudget } = useBudgets();
  const nameRef = useRef<HTMLInputElement>(null);
  const maxRef = useRef<HTMLInputElement>(null);
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log(e);
    addBudget({
      name: nameRef?.current?.value || "",
      max: parseFloat(maxRef?.current?.value || "")
    });
    handleClose();
  }

  return (
    <Modal show={show} onHide={handleClose}>
      <Form onSubmit={(e) => handleSubmit(e)}>
        <Modal.Header closeButton>
          <Modal.Title>New Budget</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control type="text" required ref={nameRef} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Maximum Spending</Form.Label>
            <Form.Control
              type="number"
              required
              min={0}
              step={0.01}
              ref={maxRef}
            />
          </Form.Group>
          <div className="d-flex justify-content-end">
            <Button variant="primary" type="submit">
              Add
            </Button>
          </div>
        </Modal.Body>
      </Form>
    </Modal>
  );
}
