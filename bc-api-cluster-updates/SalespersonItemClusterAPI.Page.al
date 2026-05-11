page 50122 "API Salesperson Item Clusters"
{
    PageType = API;
    Caption = 'apiSalespersonItemClusters';
    APIPublisher = 'bs';
    APIGroup = 'tirocinio';
    APIVersion = 'v1.0';
    EntityName = 'salespersonItemCluster';
    EntitySetName = 'salespersonItemClusters';

    SourceTable = "Salesperson Item Cluster";
    DelayedInsert = true;
    ODataKeyFields = SystemId;

    layout
    {
        area(Content)
        {
            repeater(Group)
            {
                field(systemId; Rec.SystemId)
                {
                    Caption = 'SystemId';
                }

                field(id; Rec.ID)
                {
                    Caption = 'ID';
                }

                field(salesPersonCode; Rec."Salesperson Code")
                {
                    Caption = 'Salesperson Code';
                }

                field(itemNo; Rec."Item No.")
                {
                    Caption = 'Item No.';
                }

                field(clusterCode; Rec."Cluster Code")
                {
                    Caption = 'Cluster Code';
                }

                field(description; Rec.Description)
                {
                    Caption = 'Description';
                }

                field(prezzoUnitario; Rec."Unit Price")
                {
                    Caption = 'Prezzo Unitario';
                }

                field(unitaMisura; Rec."Unit of Measure")
                {
                    Caption = 'Unita Misura';
                }
            }
        }
    }
}
