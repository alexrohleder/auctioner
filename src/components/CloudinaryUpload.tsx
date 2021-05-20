import { useEffect, useRef } from "react";
import Loading from "./Loading";

function createUploadWidget(cloudinary, setLoading, append) {
  return cloudinary.createUploadWidget(
    {
      cloudName: "dlhgof5cx",
      uploadPreset: "bvzvgpvy",
      sources: [
        "camera",
        "google_drive",
        "facebook",
        "dropbox",
        "instagram",
        "local",
      ],
      showAdvancedOptions: false,
      cropping: false,
      multiple: true,
      defaultSource: "local",
      styles: {
        palette: {
          window: "#FFFFFF",
          windowBorder: "#90A0B3",
          tabIcon: "#0078FF",
          menuIcons: "#5A616A",
          textDark: "#000000",
          textLight: "#FFFFFF",
          link: "#505050",
          action: "#000000",
          inactiveTabIcon: "#0E2F5A",
          error: "#F44235",
          inProgress: "#0078FF",
          complete: "#20B832",
          sourceBg: "#E4EBF1",
        },
        fonts: {
          default: {
            active: true,
          },
        },
      },
    },
    (err, payload) => {
      if (payload.event === "queues-start") {
        setLoading(true);
      } else if (payload.event === "success") {
        append({
          width: payload.info.width,
          height: payload.info.height,
          url: payload.info.url,
          thumbnail: payload.info.thumbnail_url,
        });
      } else if (payload.event === "queues-end") {
        setLoading(false);
      }

      // todo: treat errors...
    }
  );
}

type Props = {
  images: any[];
  setImages: any;
  isLoading: boolean;
  isDisabled: boolean;
  setLoading: any;
};

function CloudinaryUpload(props: Props) {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const script = document.createElement("script");

    script.type = "text/javascript";
    script.src = "https://widget.cloudinary.com/v2.0/global/all.js";
    script.async = true;

    script.onload = () => {
      const widget = createUploadWidget(
        // @ts-ignore cloudinary will register itself in the window after loading
        window.cloudinary,
        props.setLoading,
        (image) => props.setImages((curr) => [...curr, image])
      );

      if (buttonRef.current) {
        buttonRef.current.addEventListener("click", () => {
          widget.open();
        });
      }
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div>
      <div className="flex gap-2">
        <button
          ref={buttonRef}
          type="button"
          className="btn"
          disabled={props.isLoading || props.isDisabled}
        >
          Upload images
        </button>
        {props.isLoading && <Loading />}
      </div>
      <div className="flex gap-2 mt-2">
        {props.images.map((image) => (
          <img key={image.thumbnail} src={image.thumbnail} />
        ))}
      </div>
    </div>
  );
}

export default CloudinaryUpload;
