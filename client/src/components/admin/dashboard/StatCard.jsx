import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';

const StatCard = ({ title, value, icon: Icon, description }) => {
  const descriptionColorClass = description && description.includes('+') 
    ? 'text-green-500' 
    : description && description.includes('-') 
    ? 'text-red-500' 
    : 'text-muted-foreground';

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className={`text-xs ${descriptionColorClass}`}>{description}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;
