import Avatar from "components/Avatar/Avatar";
import { useNavigate } from "react-router-dom";
import CardSubscriptionsWrapper from "./CardSubscriptionsStyle";

function CardSubscriptions({ subscriberId, imgLink, name, description }) {
  const navigate = useNavigate();
  return (
    <CardSubscriptionsWrapper>
      <div
        className="card-container"
        onClick={() => {
          console.log("abcd");
          navigate(`/profile/${subscriberId}`);
        }}
      >
        <Avatar
          style={{ width: "100px", height: "100px" }}
          imgLink={imgLink}
          fullName={name}
        />
        <h3>{name}</h3>
        <span>{description}</span>
      </div>
    </CardSubscriptionsWrapper>
  );
}

export default CardSubscriptions;
