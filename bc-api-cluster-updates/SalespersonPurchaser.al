tableextension 50100 "Salesperson/Purchaser" extends "Salesperson/Purchaser"
{
    fields
    {
        field(50000; "Password"; Text[100])
        {
            Caption = 'Password';
            ExtendedDatatype = Masked;
        }

        field(50001; "Item Cluster Code"; Code[20])
        {
            Caption = 'Item Cluster Code';
            TableRelation = "Item Cluster";
        }

        field(50002; "Item Cluster Group Code"; Code[20])
        {
            Caption = 'Item Cluster Group Code';
            DataClassification = CustomerContent;
        }

        field(50003; "All Items"; Boolean)
        {
            Caption = 'All Items';
            DataClassification = CustomerContent;
            // If true, the frontend loads every item from the standard item API.
            // If false, it loads only items assigned in "Salesperson Item Cluster".
        }
    }
}
