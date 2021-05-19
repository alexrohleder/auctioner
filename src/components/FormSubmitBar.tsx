import Loading from "./Loading";

type Props = {
  isSubmitting: boolean;
  isDeleting?: boolean;
  isDirty?: boolean;
  isValidating?: boolean;
  form?: string;
  onDelete?: () => void;
};

function FormSubmitBar(props: Props) {
  const isButtonsDisabled =
    props.isValidating || props.isSubmitting || props.isDeleting;

  const onDelete = () => {
    if (props.onDelete) {
      const shouldContinue = confirm("Do you really want to delete this?");

      if (shouldContinue) {
        props.onDelete();
      }
    }
  };

  return (
    <div className="custom-container flex items-center justify-between px-0 py-2">
      <div className="flex text-gray-700">
        {props.isValidating && <Loading label="Fetching data..." />}
      </div>
      <div className="flex items-center gap-4">
        {props.isSubmitting && <Loading />}
        <fieldset
          className="flex items-center justify-end gap-4"
          disabled={isButtonsDisabled}
        >
          {props.onDelete && (
            <button
              type="button"
              className="btn btn--danger"
              onClick={onDelete}
            >
              Delete
            </button>
          )}
          <button type="submit" className="btn btn--primary" form={props.form}>
            Save
          </button>
        </fieldset>
      </div>
    </div>
  );
}

export default FormSubmitBar;
