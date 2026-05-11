table 50121 "Item Cluster Line"
{
    Caption = 'Item Cluster Line';
    DataClassification = CustomerContent;

    fields
    {
        field(1; "Cluster Code"; Code[20])
        {
            Caption = 'Cluster Code';
            DataClassification = CustomerContent;
            TableRelation = "Item Cluster";
        }

        field(2; "Item No."; Code[20])
        {
            Caption = 'Item No.';
            DataClassification = CustomerContent;
            TableRelation = Item;

            trigger OnValidate()
            var
                Item: Record Item;
            begin
                if Item.Get("Item No.") then
                    Description := Item.Description
                else
                    Description := '';
            end;
        }

        field(3; Description; Text[100])
        {
            Caption = 'Description';
            DataClassification = CustomerContent;
            Editable = false;
        }
    }

    keys
    {
        key(PK; "Cluster Code", "Item No.")
        {
            Clustered = true;
        }
    }
}
