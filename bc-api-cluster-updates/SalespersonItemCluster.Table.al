table 50122 "Salesperson Item Cluster"
{
    Caption = 'Salesperson Item Cluster';
    DataClassification = CustomerContent;

    fields
    {
        field(1; ID; Integer)
        {
            Caption = 'ID';
            AutoIncrement = true;
            DataClassification = SystemMetadata;
        }

        field(2; "Salesperson Code"; Code[20])
        {
            Caption = 'Salesperson Code';
            DataClassification = CustomerContent;
            TableRelation = "Salesperson/Purchaser";
        }

        field(3; "Item No."; Code[20])
        {
            Caption = 'Item No.';
            DataClassification = CustomerContent;
            TableRelation = Item;

            trigger OnValidate()
            var
                Item: Record Item;
            begin
                if Item.Get("Item No.") then begin
                    Description := Item.Description;
                    "Unit Price" := Item."Unit Price";
                    "Unit of Measure" := Item."Sales Unit of Measure";
                end else begin
                    Description := '';
                    "Unit Price" := 0;
                    "Unit of Measure" := '';
                end;
            end;
        }

        field(4; "Cluster Code"; Code[20])
        {
            Caption = 'Cluster Code';
            DataClassification = CustomerContent;
            TableRelation = "Item Cluster";
        }

        field(5; Description; Text[100])
        {
            Caption = 'Description';
            DataClassification = CustomerContent;
            Editable = false;
        }

        field(6; "Unit Price"; Decimal)
        {
            Caption = 'Unit Price';
            DataClassification = CustomerContent;
            Editable = false;
        }

        field(7; "Unit of Measure"; Code[10])
        {
            Caption = 'Unit of Measure';
            DataClassification = CustomerContent;
            Editable = false;
        }
    }

    keys
    {
        key(PK; ID)
        {
            Clustered = true;
        }

        key(SalespersonItemCluster; "Salesperson Code", "Item No.", "Cluster Code")
        {
            Unique = true;
        }
    }
}
