import Loading from "./Loading";

type Props = {
  isSubmitting: boolean;
  isValidating?: boolean;
  form?: string;
};

function FormSubmitBar(props: Props) {
  return (
    <div className="bottom-4 fixed left-0 right-0">
      <div className="custom-container flex items-center justify-between px-4 py-2 bg-white border rounded shadow-lg">
        <div className="flex text-gray-700">
          {props.isValidating && <Loading label="Fetching data..." />}
        </div>
        <div className="flex items-center gap-4">
          {props.isSubmitting && <Loading />}
          <div className="flex items-center justify-end gap-4">
            <button
              type="submit"
              className="btn btn--primary"
              form={props.form}
              disabled={props.isValidating || props.isSubmitting}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FormSubmitBar;
