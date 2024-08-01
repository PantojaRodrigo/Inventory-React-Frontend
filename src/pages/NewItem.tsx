import ItemForm from "../components/ItemForm";

export default function NewItem() {
  return (
    <>
      <ItemForm method="POST" item={null}></ItemForm>
    </>
  );
}
