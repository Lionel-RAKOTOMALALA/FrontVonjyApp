function StatusBadge({ status, count, badgeClass }) {
  return (
    <span>
      {status} 
      <span className={`badge ${badgeClass} rounded fw-bolder ms-1`}>{count}</span>
    </span>
  );
}

export default StatusBadge;
